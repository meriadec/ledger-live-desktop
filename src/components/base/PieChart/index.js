// @flow

import React, { PureComponent } from 'react'
import * as d3 from 'd3'

class PieChart extends PureComponent {
  componentDidMount() {
    const { data } = this.props
    const svg = d3.select(this.svg)
    const width = +svg.attr('width')
    const height = +svg.attr('height')
    const radius = Math.min(width, height) / 2
    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`)
    const pie = d3
      .pie()
      .sort(null)
      .value(d => d.balance)
    const path = d3
      .arc()
      .outerRadius(radius - 10)
      .innerRadius(0)

    const label = d3
      .arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40)

    const arc = g
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc')

    arc
      .append('path')
      .attr('d', path)
      .attr('fill', d => d.data.currency.color)

    arc
      .append('text')
      .attr('transform', d => `translate(${label.centroid(d)})`)
      .attr('dy', '0.35em')
      .text(d => d.data.currency.name)
  }
  render() {
    return <svg width="300" height="300" ref={n => (this.svg = n)} />
  }
}

export default PieChart
