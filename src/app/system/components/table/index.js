import React from 'react'
import Base from 'common/base'
import PropTypes from 'prop-types'
import './style.less'


class Table extends Base {
  static defaultProps = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
    flexItemId: PropTypes.arrayOf(PropTypes.number)
  }

  isExpansion(index) {
    const { flexItemId } = this.props
    return flexItemId.indexOf(index) > -1 ? 'expansion' : ''
  }

  renderTitle() {
    const { columns } = this.props

    return columns.map((column, index) => (
      <th className={this.isExpansion(index)} data-index={column.dataIndex} key={column.key}>{column.title}</th>
    ))
  }

  renderBody() {
    const dataSource = this.props.dataSource

    return dataSource.map(data => {
      return (
        <tr key={data.key}>
          {
            Object.keys(data).map((key, index) => {
              return (key !== 'key' ? (
                <td
                  key={index}
                  className={this.isExpansion(index - 1)}
                >
                  {
                    data[key]
                  }
                </td>
              ) : null
              )
            })
          }
        </tr>
      )
    })
  }

  render() {
    return (
      <table className="admin-table">
        <thead className="admin-table-head">
          <tr>
            {this.renderTitle()}
          </tr>
        </thead>
        <tbody className="admin-table-body">
          {this.renderBody()}
        </tbody>
      </table>
    )
  }
}

export default Table
