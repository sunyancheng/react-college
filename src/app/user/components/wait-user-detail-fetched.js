import Base from 'common/base'
import api from 'common/api'
import { updateUserDetail } from 'common/app/app-actions'

export default (class extends Base {
  state = {
    init: false
  }
  componentDidMount() {
    api.userDashboardInfoDetail()
      .then(detail => this.dispatch(updateUserDetail(detail)))
      .then(() => this.setState({ init: true }))
  }
  render() {
    const { children } = this.props
    if (!this.state.init) return null
    return children
  }
}).connect(() => ({}))
