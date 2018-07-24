import React from 'react';
import api from 'common/api'
import initVNC from '../util/init'
import parseurl from 'parseurl'
import qs from 'qs'
import './style.less'
export default class extends React.Component {

  componentDidMount() {
    let { r: resource_id, c: course_id, role: __role, s: server_id, u: user_experiment_id } = this.props.match.params;
    let method = 'experimentVNC', params = { resource_id, course_id, __role, server_id, user_experiment_id }
    if (__role/1 === 16) {
      method = 'systemExperimentVNC'
      params = { experiment_id: user_experiment_id, server_id }
    }
    api[method](params).then(({ vnc_url = '' }) => {
      this.create(vnc_url)
    })
  }

  create = (url) => {
    let { hostname = '', port = '', query = {} } = parseurl({ url }) || {}
    let { token } = qs.parse(query) || {}
    initVNC({ host: hostname, port, token })
  }


  render () {
    return (
      <div id="noVNC_status_bar">
        <div id="noVNC_left_dummy_elem"/>
        <div id="noVNC_status">Loading</div>
        <div id="noVNC_buttons">
          <input type="button" value="Send CtrlAltDel" id="sendCtrlAltDelButton" className="noVNC_shown"/>
          <span id="noVNC_power_buttons" className="noVNC_hidden">
            <input type="button" value="Shutdown" id="machineShutdownButton"/>
            <input type="button" value="Reboot" id="machineRebootButton"/>
            <input type="button" value="Reset" id="machineResetButton"/>
          </span>
        </div>
      </div>
    );
  }
}
