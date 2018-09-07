// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/helpers/currencies'

import PieChart from 'components/base/PieChart'

const stories = storiesOf('Components', module)

const data = [
  { currency: getCryptoCurrencyById('bitcoin'), balance: 361642 },
  { currency: getCryptoCurrencyById('ethereum'), balance: 22400 },
  { currency: getCryptoCurrencyById('dogecoin'), balance: 73245 },
  { currency: getCryptoCurrencyById('ripple'), balance: 40000 },
  { currency: getCryptoCurrencyById('digibyte'), balance: 135718 },
]

stories.add('PieChart', () => <PieChart data={data} />)
