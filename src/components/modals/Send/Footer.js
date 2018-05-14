// @flow

import React from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { exchangeSettingsForAccountSelector } from 'reducers/settings'

import type { T } from 'types/common'

import { ModalFooter } from 'components/base/Modal'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import CounterValue from 'components/CounterValue'
import FormattedVal from 'components/base/FormattedVal'
import Label from 'components/base/Label'
import Text from 'components/base/Text'

type Props = {
  t: T,
  account: Account,
  amount: number,
  fees: number,
  onNext: Function,
  canNext: boolean,
  showTotal: boolean,
  exchange: string,
}

const mapStateToProps = createStructuredSelector({
  exchange: exchangeSettingsForAccountSelector,
})

function Footer({ exchange, account, amount, fees, t, onNext, canNext, showTotal }: Props) {
  const totalSpent = amount + fees
  return (
    <ModalFooter>
      <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
        {totalSpent > account.balance ? (
          <Box grow>
            <Label>
              <Text color="pearl">{t('send:notEnoughBalance')}</Text>
            </Label>
          </Box>
        ) : (
          showTotal && (
            <Box grow>
              <Label>{t('send:totalSpent')}</Label>
              <Box horizontal flow={2} align="center">
                <FormattedVal
                  disableRounding
                  color="dark"
                  val={totalSpent}
                  unit={account.unit}
                  showCode
                />
                <Box horizontal align="center">
                  <Text ff="Rubik" fontSize={3}>
                    {'('}
                  </Text>
                  <CounterValue
                    exchange={exchange}
                    currency={account.currency}
                    value={totalSpent}
                    disableRounding
                    color="grey"
                    fontSize={3}
                    showCode
                  />
                  <Text ff="Rubik" fontSize={3}>
                    {')'}
                  </Text>
                </Box>
              </Box>
            </Box>
          )
        )}
        <Button primary onClick={onNext} disabled={!canNext}>
          {'Next'}
        </Button>
      </Box>
    </ModalFooter>
  )
}

export default connect(mapStateToProps)(Footer)
