import React from 'react'
import PropTypes from 'prop-types'
import Base from 'common/base'
import PageFilter from 'common/page/page-filter'
import PagePagination from 'common/page/page-pagination';
import { PageLayout, PageContent, PageHeader } from './page-layout'
import PageTable from 'common/page/page-table'
const { Cabinet, Rest } = PageContent;

class Page extends Base {
  static defaultProps = {
    selectId: (i, index) => (i.id || '') + index
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    filters: PropTypes.array,
    columns: PropTypes.array.isRequired,
    checkColumn: PropTypes.bool
  }

  componentDidMount() {
    Promise.resolve(typeof (this.props.initState || {}) === 'object' ? Promise.resolve(this.props.initState) : this.props.initState()).then((initState) => {
      this.dispatch(this.props.actions.initPage(initState || {}))
      this.dispatch(this.props.actions.getPage())
    })
  }

  componentWillUnmount() {
    this.dispatch(this.props.actions.clearPage())
  }

  changePagination = (...args) => this.dispatch(this.props.actions.changePagination(...args))

  render() {
    const { title, columns, filters, children, selectId, isInit, actions, buttons = [], checkColumn, exportUrl = "" } = this.props
    if (!isInit) return null
    return (
      <PageLayout>
        <PageHeader actions={actions} title={title} btn={buttons} />
        <PageContent>
          {filters && filters.length &&
            <Cabinet>
              <PageFilter exportUrl={exportUrl} actions={actions} config={filters} />
            </Cabinet>
          }
          <Rest>
            <PageTable
              actions={actions}
              columns={columns}
              selectId={selectId}
              checkColumn={checkColumn}
            />
            <PagePagination onChange={this.changePagination} />
          </Rest>
        </PageContent>
        {children}
      </PageLayout>
    )
  }
}

export default Page.connect(state => {
  const { isInit, list } = state.page;
  return { isInit, list };
});
