// @flow

import type { Account, Operation, Currency } from '@ledgerhq/live-common/lib/types'

// a WalletBridge is implemented on renderer side.
// this is an abstraction on top of libcore / ethereumjs / ripple js / ...
// that would directly be called from UI needs.

/* we would have this typically:
const getBridge = (currency: Currency): WalletBridge<*> => {
  if (currency.id === 'ethereum') return EthereumJSImpl // polyfill js
  if (currency.id === 'ripple') return RippleJSImpl // polyfill js
  return LibcoreImpl // libcore for the rest
}
*/

export type DeviceId = string // for now it's just usb path

export type Observer<T> = {
  next: T => void,
  complete: () => void,
  error: (?Error) => void,
}

export type Subscription = {
  unsubscribe: () => void,
}

export interface WalletBridge<Transaction> {
  // initially, at "import", we want to load all accounts from the device for a given currency...
  scanAccountsOnDevice(
    currency: Currency,
    deviceId: DeviceId,
    observer: Observer<Account>,
  ): Subscription;

  // synchronize an account. it ends when it has finish to sync,
  // if there are some account changes, updater function get emitted.
  // an update function is just a Account => Account that perform the changes. (this is safer for race-conditions)
  // this can emit new version of the account. typically these field can change over time:
  // - operations if there are new ones (prepended)
  // - balance
  // - blockHeight
  synchronize(accountId: string, observer: Observer<(Account) => Account>): Subscription;

  // for a given account, UI wants to load more operations in the account.operations
  // if you can't do it or there is no more things to load, just return account,
  // otherwise return account updater that add operations in account.operations
  // count is the desired number to pull (but implementation can decide)
  pullMoreOperations(accountId: string, count: number): Promise<(Account) => Account>;

  // Related to send funds:

  // a Transaction object, this is a black box that can be improved by the following methods & components...
  // IMPORTANT: this is only a temporary object on UI side! not on libcore side
  // underlying implementation can have the same concept too, the point is we need sync api for the UI
  // if you have async api under the hood, you will have to cache things and return tmp values..

  createTransaction(account: Account): Transaction;

  editTransactionAmount(account: Account, transaction: Transaction, amount: number): Transaction;

  getTransactionAmount(account: Account, transaction: Transaction): number;

  editTransactionRecipient(
    account: Account,
    transaction: Transaction,
    recipient: string,
  ): Transaction;

  getTransactionRecipient(account: Account, transaction: Transaction): string;

  // render the whole Fees section of the form
  EditFeeComponent?: React$ComponentType<{
    account: Account,
    value: Transaction,
    onChange: Transaction => void,
  }>;

  // render the whole advanced part of the form
  EditAdvancedOptions?: React$ComponentType<{
    account: Account,
    value: Transaction,
    onChange: Transaction => void,
  }>;

  getTotalSpent(account: Account, transaction: Transaction): Promise<number>;

  getMaxAmount(account: Account, transaction: Transaction): Promise<number>;

  /**
   * finalize the transaction by
   * - signing it with the ledger device
   * - broadcasting it to network
   * - retrieve and return the Operation object related to this transaction (not sure yet if will be possible. idea is at least we should get a tx hash)
   *
   * note: transaction balance is close to account.balance, it is expected to wipe all.
   * to implement that, we might want to have special logic `account.balance-transaction.amount < dust` but not sure where this should leave (i would say on UI side because we need to inform user visually).
   */
  signAndBroadcast(
    account: Account,
    transaction: Transaction,
    deviceId: DeviceId,
  ): Promise<Operation>;
}
