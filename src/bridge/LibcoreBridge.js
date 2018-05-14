// @flow
import { ipcRenderer } from 'electron'
import { decodeAccount } from 'reducers/accounts'
import runJob from 'renderer/runJob'
import type { WalletBridge } from './types'

const notImplemented = new Error('LibcoreBridge: not implemented')

// TODO for ipcRenderer listeners we should have a concept of requestId because
// to be able to listen to events that only concerns you

const LibcoreBridge: WalletBridge<*> = {
  synchronize(accountId, { next, complete, error }) {
    const unbind = () => ipcRenderer.removeListener('msg', handleAccountSync)
    function handleAccountSync(e, msg) {
      switch (msg.type) {
        case 'account.sync.progress': {
          next(a => a)
          // use next(), to actually emit account updates.....
          break
        }
        case 'account.sync.fail': {
          unbind()
          error(new Error('failed')) // TODO more error detail
          break
        }
        case 'account.sync.success': {
          unbind()
          complete()
          break
        }
        default:
      }
    }

    ipcRenderer.on('msg', handleAccountSync)

    // TODO how to start the sync ?!

    return {
      unsubscribe() {
        unbind()
        // maybe we need to also tell libcore we stop for now... (in practice we don't call this today)
      },
    }
  },

  scanAccountsOnDevice(currency, deviceId, { next, complete, error }) {
    const unbind = () => ipcRenderer.removeListener('msg', handleMsgEvent)

    function handleMsgEvent(e, { data, type }) {
      if (type === 'accounts.scanAccountsOnDevice.accountScanned') {
        // create Account from AccountRaw account scanned on device
        next({
          ...decodeAccount(data),
          archived: true,
        })
      }
    }

    ipcRenderer.on('msg', handleMsgEvent)

    let unsubscribed

    runJob({
      channel: 'accounts',
      job: 'scan',
      successResponse: 'accounts.scanAccountsOnDevice.success',
      errorResponse: 'accounts.scanAccountsOnDevice.fail',
      data: {
        devicePath: deviceId,
        currencyId: currency.id,
      },
    }).then(
      () => {
        if (unsubscribed) return
        unbind()
        complete()
      },
      e => {
        if (unsubscribed) return
        unbind()
        error(e)
      },
    )

    return {
      unsubscribe() {
        unsubscribed = true
        unbind()
        // we need to tell libcore to stop scanning.. typically user have left the screen.
      },
    }
  },

  refreshLastOperations: () => Promise.reject(notImplemented),

  pullMoreOperations: () => Promise.reject(notImplemented),

  createTransaction: () => null,

  editTransactionAmount: () => null,

  getTransactionAmount: () => 0,

  editTransactionRecipient: () => null,

  getTransactionRecipient: () => '',

  getTotalSpent: () => Promise.resolve(0),

  getMaxAmount: () => Promise.resolve(0),

  signAndBroadcast: () => Promise.reject(notImplemented),
}

export default LibcoreBridge
