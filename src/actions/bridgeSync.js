// @flow
import type { AsyncState } from 'reducers/bridgeSync'
import type { Account } from '@ledgerhq/live-common/lib/types'

export const setAccountSyncState = (account: Account, state: AsyncState) => ({
  type: 'SET_ACCOUNT_SYNC_STATE',
  accountId: account.id,
  state,
})

export const setAccountPullMoreState = (account: Account, state: AsyncState) => ({
  type: 'SET_ACCOUNT_PULL_MORE_STATE',
  accountId: account.id,
  state,
})
