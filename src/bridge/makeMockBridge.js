// @flow
import {
  genAccount,
  genAddingOperationsInAccount,
  genOperation,
} from '@ledgerhq/live-common/lib/mock/account'
import Prando from 'prando'
import type { Operation } from '@ledgerhq/live-common/lib/types'
import type { WalletBridge } from './types'

const defaultOpts = {
  syncSuccessRate: 0.8,
  scanAccountDeviceSuccessRate: 0.8,
  transactionsSizeTarget: 100,
}

const delay = ms => new Promise(success => setTimeout(success, ms))

type Opts = *

function makeMockBridge(opts?: Opts): WalletBridge<*> {
  const {
    syncSuccessRate,
    transactionsSizeTarget,
    EditFeeComponent,
    EditAdvancedOptions,
    scanAccountDeviceSuccessRate,
  } = {
    ...defaultOpts,
    ...opts,
  }

  const broadcasted: { [_: string]: Operation[] } = {}

  const syncTimeouts = {}

  return {
    synchronize(accountId: string, { error, next, complete }) {
      if (syncTimeouts[accountId]) {
        // this is just for tests. we'll assume impl don't need to handle race condition on this function.
        console.warn('synchronize was called multiple pending time for same accounts!!!')
      }
      syncTimeouts[accountId] = setTimeout(() => {
        if (Math.random() < syncSuccessRate) {
          const ops = broadcasted[accountId] || []
          broadcasted[accountId] = []
          next(account => {
            account = { ...account }
            account.blockHeight++
            for (const op of ops) {
              account.balance += op.amount
            }
            return account
          })
          complete()
        } else {
          error(new Error('Sync Failed'))
        }
        syncTimeouts[accountId] = null
      }, 20000)

      return {
        unsubscribe() {
          clearTimeout(syncTimeouts[accountId])
          syncTimeouts[accountId] = null
        },
      }
    },

    scanAccountsOnDevice(currency, deviceId, { next, complete, error }) {
      let unsubscribed = false

      async function job() {
        if (Math.random() > scanAccountDeviceSuccessRate) {
          await delay(5000)
          if (!unsubscribed) error(new Error('scan failed'))
          return
        }
        const nbAccountToGen = 3
        for (let i = 0; i < nbAccountToGen && !unsubscribed; i++) {
          await delay(2000)
          const account = genAccount(String(Math.random()), {
            operationsSize: 0,
            currency,
          })
          account.archived = true
          if (!unsubscribed) next(account)
        }
        if (!unsubscribed) complete()
      }

      job()

      return {
        unsubscribe() {
          unsubscribed = true
        },
      }
    },

    pullMoreOperations: async (_accountId, _desiredCount) => {
      await delay(1000)
      return account => {
        if (transactionsSizeTarget >= account.operations.length) return account
        const count = transactionsSizeTarget * (0.1 + 0.5 * Math.random())
        account = { ...account }
        return genAddingOperationsInAccount(account, count, String(Math.random()))
      }
    },

    createTransaction: () => ({
      amount: 0,
      recipient: '',
      // ONLY part of this mock have this, each type of coin might have diff concepts...
      feeCost: 0.01,
    }),

    editTransactionAmount: (account, t, amount) => ({
      ...t,
      amount,
    }),

    getTransactionAmount: (a, t) => t.amount,

    editTransactionRecipient: (account, t, recipient) => ({
      ...t,
      recipient,
    }),

    getTransactionRecipient: (a, t) => t.recipient,

    EditFeeComponent,

    EditAdvancedOptions,

    getTotalSpent: (a, t) => Promise.resolve(t.amount + t.feeCost),

    getMaxAmount: (a, t) => Promise.resolve(a.balance - t.feeCost),

    signAndBroadcast: async (account, t) => {
      const rng = new Prando()
      const op = genOperation(account, account.operations, account.currency, rng)
      op.amount = -t.amount
      op.address = t.recipient
      op.blockHeight = account.blockHeight
      op.date = new Date()
      broadcasted[account.id] = (broadcasted[account.id] || []).concat(op)
      return op
    },
  }
}

export default makeMockBridge
