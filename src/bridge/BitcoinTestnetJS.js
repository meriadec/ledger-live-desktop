// @flow
import type { WalletBridge } from './types'

const genericError = new Error('UnsupportedBridge')

const UnsupportedBridge: WalletBridge<*> = {
  synchronize(a, { error }) {
    Promise.resolve(genericError).then(error)
    return { unsubscribe() {} }
  },

  scanAccountsOnDevice(currency, deviceId, { error }) {
    Promise.resolve(genericError).then(error)
    return { unsubscribe() {} }
  },

  refreshLastOperations: () => Promise.reject(genericError),

  pullMoreOperations: () => Promise.reject(genericError),

  createTransaction: () => null,

  editTransactionAmount: () => null,

  getTransactionAmount: () => 0,

  editTransactionRecipient: () => null,

  getTransactionRecipient: () => '',

  getTotalSpent: () => Promise.resolve(0),

  getMaxAmount: () => Promise.resolve(0),

  signAndBroadcast: () => Promise.reject(genericError),
}

export default UnsupportedBridge
