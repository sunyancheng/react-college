import React from 'react'
import Base from 'common/base'
import PropTypes from 'prop-types'
import { InputLayout } from 'common/input-layout'
import { Button } from 'common/button';
import './style.less'

class PageFilter extends Base {

  static propTypes = {
    config: PropTypes.arrayOf(PropTypes.object),
    onQuery: PropTypes.func,
    handleQuery: PropTypes.func
  }

  setCrieria = (crieria) => {
    this.dispatch(this.props.actions.setCriteria(crieria))
  }

  onQuery = () => {
    const { isList } = this.props
    this.dispatch(isList ? this.props.actions.getList() : this.props.actions.getPage())
    this.props.handleQuery && this.props.handleQuery()
  }

  onReset = () => {
    this.dispatch(this.props.actions.resetCriteria())
  }

  renderFilterGroup = (config) => {
    return config.map((filter, i) => {
      return (
        <InputLayout key={i} label={filter.label}>
          {filter.render(filter, this)}
        </InputLayout>
      )
    })
  }

  render() {
    const { exportUrl, list, actions } = this.props
    return (
      <div className="page-layout__content__cabinet__page-fliter">
        <div className="page-layout__content__cabinet__page-fliter-left">
          {
            this.renderFilterGroup(this.props.config)
          }
        </div>
        <div className="page-layout__content__cabinet__page-fliter-right">
          <div className="page-layout__content__cabinet__page-fliter-right-wrap">
            <Button type="primary" ghost onClick={this.onReset} size="small">重置</Button>
            <Button type="primary" onClick={this.onQuery} size="small">查询</Button>
            {!!exportUrl && <Button disabled={!list.length} size="small" onClick={() => this.dispatch(actions.showModal('export'))}>导出</Button>}
          </div>
        </div>
      </div>
    )
  }
}

export default PageFilter.connect(state => {
  const { criteria = {}, list = [] } = state.page
  return {
    criteria,
    list
  }
})
