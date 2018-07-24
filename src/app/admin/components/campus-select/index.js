import Base from 'common/base'
import React from 'react'
import { Select2 } from 'common/select'
import './style.less'
import { setCampusId } from 'admin/actions/admin'
export default (class extends Base {
  handleChange = campus_id => {
    this.dispatch(setCampusId(campus_id))
    if (/^\/class\/manage\/\d+$/.test(this.props.location.pathname)) {
      this.props.history.push('/class')
    }
  }
  render() {
    const { campusList, campus_id } = this.props
    return (
      <div className="campus-select">
        <Select2 value={campus_id} options={campusList}
          getValue={i => i.campus_id}
          getLabel={i => i.name}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}).connect(state => ({ campusList: state.app.campusList, campus_id: state.app.campus_id })).withRouter()