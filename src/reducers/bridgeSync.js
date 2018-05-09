// @flow

import { createSelector } from 'reselect'
import { handleActions } from 'redux-actions'
import type { State } from 'reducers'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { getAccounts } from './accounts'

export type AsyncState = {
  pending: boolean,
  error: ?Error,
}

export type BridgeSyncState = {
  syncs: { [accountId: string]: AsyncState },
  pullMores: { [accountId: string]: AsyncState },
}

const state: BridgeSyncState = {
  syncs: {},
  pullMores: {},
}

const handlers: Object = {
  SET_ACCOUNT_SYNC_STATE: (
    state: BridgeSyncState,
    action: {
      accountId: string,
      state: AsyncState,
    },
  ) => ({
    syncs: {
      ...state.syncs,
      [action.accountId]: action.state,
    },
  }),

  SET_ACCOUNT_PULL_MORE_STATE: (
    state: BridgeSyncState,
    action: { accountId: string, state: AsyncState },
  ) => ({
    pullMores: {
      ...state.pullMores,
      [action.accountId]: action.state,
    },
  }),
}

// Selectors

export const syncStateSelector = (state: State, { account }: { account: Account }) =>
  state.bridgeSync.syncs[account.id] || {
    pending: false,
    error: null,
  }

export const pullMoreStateSelector = (state: State, { account }: { account: Account }) =>
  state.bridgeSync.pullMores[account.id] || {
    pending: false,
    error: null,
  }

export const globalSyncStateSelector = createSelector(
  getAccounts,
  state => state,
  (accounts, state) => {
    const globalSyncState: AsyncState = {
      pending: false,
      error: null,
    }
    for (const account of accounts) {
      const syncState = syncStateSelector(state, { account })
      if (syncState.error) globalSyncState.error = syncState.error
      if (syncState.pending) globalSyncState.pending = true
    }
    return globalSyncState
  },
)

export default handleActions(handlers, state)
