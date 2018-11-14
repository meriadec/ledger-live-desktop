/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */

import React, { PureComponent } from 'react'

import Box, { Card } from 'components/base/Box'
import Switch from 'components/base/Switch'
import Button from 'components/base/Button'
import Label from 'components/base/Label'
import SelectCurrency from 'components/SelectCurrency'
import { Textarea } from 'components/base/Input'

class DecodeTx extends PureComponent {
  state = {
    currency: null,
    hex: '',
    decoded: [],
    isSegwit: false,
  }

  handleChange = e => {
    this.setState({ hex: e.target.value })
  }

  handleChangeCurrency = currency => this.setState({ currency })
  onChangeSegwit = isSegwit => this.setState({ isSegwit })

  decode = () => {
    // TODO decode, and assign to this.state.decoded
    const { hex, currency, isSegwit } = this.state
    console.log(hex, currency, isSegwit)
    this.setState({
      decoded: [{ title: 'foo', value: hex }],
    })
  }

  render() {
    const { hex, decoded, currency, isSegwit } = this.state
    return (
      <Box pt={2} pb={4} flow={2} grow>
        <Box>
          <SelectCurrency autoFocus value={currency} onChange={this.handleChangeCurrency} />
        </Box>
        {currency && currency.supportsSegwit ? (
          <Box horizontal justify="flex-end" align="center" flow={3}>
            <Box horizontal align="center" flow={1}>
              <Box ff="Museo Sans|Bold" fontSize={4}>
                {'segwit'}
              </Box>
              <Switch isChecked={isSegwit} onChange={this.onChangeSegwit} />
            </Box>
          </Box>
        ) : null}
        <Box>
          <Label>{'Transaction hex'}</Label>
          <Textarea value={hex} onChange={this.handleChange} />
        </Box>
        <Box horizontal>
          <Button primary onClick={this.decode}>
            {'Decode'}
          </Button>
        </Box>
        {!!decoded.length && <TxDecoded decoded={decoded} />}
      </Box>
    )
  }
}

class TxDecoded extends PureComponent<*> {
  render() {
    const { decoded } = this.props
    return (
      <Card grow shrink relative>
        <Box
          flow={4}
          p={2}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'auto',
          }}
        >
          {decoded.map((item, i) => (
            <Box key={i}>
              <Box ff="Open Sans|SemiBold" grow color="dark">
                {item.title}
              </Box>
              <Box
                selectable
                cursor="text"
                style={{ wordWrap: 'break-word', fontFamily: 'monospace' }}
                bg="lightGrey"
              >
                {item.value}
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    )
  }
}

export default DecodeTx
