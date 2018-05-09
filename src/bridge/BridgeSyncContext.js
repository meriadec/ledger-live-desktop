// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { createStructuredSelector } from 'reselect'
import { updateAccount } from 'actions/accounts'
import type { State } from 'reducers'
import { setAccountSyncState, setAccountPullMoreState } from 'actions/bridgeSync'
import { pullMoreStateSelector, syncStateSelector } from 'reducers/bridgeSync'
import { accountsSelector } from 'reducers/accounts'
import { getBridgeForCurrency } from '.'

// Unify the synchronization management for bridges with the redux store
// it handles automatically re-calling synchronize
// this is an even high abstraction than the bridge

// $FlowFixMe can't wait flow implement createContext
const BridgeSyncContext = React.createContext(() => {})

type BridgeSyncProviderProps = {
  children: *,
}

type BridgeSyncProviderOwnProps = BridgeSyncProviderProps & {
  state: State,
  accounts: Account[],
  updateAccount: Account => void,
  setAccountSyncState: (Account, AsyncState) => *,
  setAccountPullMoreState: (Account, AsyncState) => *,
}

type AsyncState = {
  pending: boolean,
  error: ?Error,
}

type BridgeSync = {
  synchronize: (account: Account) => Promise<void>,

  // sync for all accounts (if there were errors it stopped)
  syncAll: () => {},

  //
  pullMoreOperations: (account: Account, count: number) => Promise<void>,
}

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
  state: s => s,
})

const actions = {
  updateAccount,
  setAccountSyncState,
  setAccountPullMoreState,
}

class Provider extends Component<BridgeSyncProviderOwnProps, BridgeSync> {
  constructor() {
    super()
    const syncPromises = {}
    const syncSubs = {}
    const pullMorePromises = {}

    const getSyncState = account => syncStateSelector(this.props.state, { account })

    const getPullMoreOperationsState = account =>
      pullMoreStateSelector(this.props.state, { account })

    const pullMoreOperations = (account, count) => {
      const state = getPullMoreOperationsState(account)
      if (state.pending) {
        return (
          pullMorePromises[account.id] || Promise.reject(new Error('no pullMore started. (bug)'))
        )
      }
      this.props.setAccountPullMoreState(account, { pending: true, error: null })
      const bridge = getBridgeForCurrency(account.currency)
      const p = bridge.pullMoreOperations(account, count).then(
        account => {
          this.props.setAccountPullMoreState(account, {
            pending: false,
            error: null,
          })
          this.props.updateAccount(account)
        },
        error => {
          this.props.setAccountPullMoreState(account, {
            pending: false,
            error,
          })
        },
      )
      pullMorePromises[account.id] = p
      return p
    }

    const synchronize = account => {
      const state = getSyncState(account)
      if (state.pending) {
        return syncPromises[account.id] || Promise.reject(new Error('no sync started. (bug)'))
      }

      this.props.setAccountSyncState(account, { pending: true, error: null })
      const bridge = getBridgeForCurrency(account.currency)
      const p = new Promise((resolve, reject) => {
        const subscription = bridge.synchronize(account, {
          next: account => {
            this.props.updateAccount(account)
          },
          complete: () => {
            this.props.setAccountSyncState(account, { pending: false, error: null })
            resolve()
          },
          error: error => {
            this.props.setAccountSyncState(account, { pending: false, error })
            reject(error)
          },
        })
        syncSubs[account.id] = subscription
      })
      syncPromises[account.id] = p
      return p
    }

    const syncAll = () => Promise.all(this.props.accounts.map(synchronize))

    this.api = {
      synchronize,
      syncAll,
      pullMoreOperations,
    }
  }

  componentDidMount() {
    const syncLoop = async () => {
      try {
        await this.api.syncAll()
      } catch (e) {
        console.error('sync issues', e)
      }
      setTimeout(syncLoop, 10 * 1000)
    }
    setTimeout(syncLoop, 2 * 1000)
  }

  api: BridgeSync

  render() {
    return (
      <BridgeSyncContext.Provider value={this.api}>
        {this.props.children}
      </BridgeSyncContext.Provider>
    )
  }
}

export const BridgeSyncProvider = connect(mapStateToProps, actions)(Provider)

export const BridgeSyncConsumer = BridgeSyncContext.Consumer
