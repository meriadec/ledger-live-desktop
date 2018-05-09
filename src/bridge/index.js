// @flow
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { WalletBridge } from './types'
import UnsupportedBridge from './UnsupportedBridge'
import makeMockBridge from './makeMockBridge'

const EthereumJSImpl = makeMockBridge()
const LibcoreImpl = UnsupportedBridge
const RippleJSImpl = UnsupportedBridge

export const getBridgeForCurrency = (currency: Currency): WalletBridge<any> => {
  if (currency.id === 'ethereum') return EthereumJSImpl // polyfill js
  if (currency.id === 'ripple') return RippleJSImpl // polyfill js
  return LibcoreImpl // libcore for the rest
}
