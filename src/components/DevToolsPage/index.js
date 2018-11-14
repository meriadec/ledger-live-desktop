import React, { PureComponent } from 'react'

import Box from 'components/base/Box'

import Pills from 'components/base/Pills'
import AccountImporter from './AccountImporter'
import DecodeTx from './DecodeTx'

export default class DevToolsPage extends PureComponent {
  state = {
    tab: 'tx',
  }

  render() {
    const { tab } = this.state
    return (
      <Box flow={2} grow>
        <Pills
          activeKey={tab}
          items={[{ key: 'importer', label: 'Import XPUB' }, { key: 'tx', label: 'Decode raw tx' }]}
          onChange={item => this.setState({ tab: item.key })}
        />
        {tab === 'importer' && <AccountImporter />}
        {tab === 'tx' && <DecodeTx />}
      </Box>
    )
  }
}
