import React from 'react';
import Base from 'common/base'
import { Button } from 'common/button'
import Sider from 'experiment/component/sider'
import actions from '../../actions'
import api from 'common/api'
import { Menu, Col, Row } from 'antd';
import ExperimentScene from 'common/experiment-scene'
import Rnd from 'react-rnd'
import { EXPERIMENT_WORK_STATUS } from 'common/config';
import { USER_EXPERIMENT_IDS, USER_EXPERIMENT_STATUS, TOPO_ENABLE_TYPES } from 'common/config'
const { Creating } = EXPERIMENT_WORK_STATUS;
// import Icon from 'common/icon';
import './style.less';
const getUserExperimentStorage = (cate, id) => {
  let ids = JSON.parse(localStorage.getItem(cate) || '{}')
  return id ? ids[id] : ids
}
export default (class extends Base {
  state = {}

  getParams = () => {
    let { rid: resource_id, cid: course_id, roleId: __role } = this.props.match.params;
    return { resource_id, course_id, __role }
  }

  componentWillMount() {
    this.dispatch(actions.setPageState({ params: this.getParams() }));
  }

  componentDidMount() {
    window.onbeforeunload = function () {
      return false;
    };
    api.experimentDetail(this.getParams()).then(({ network, url, name, mins:time_left }) => {
      network = (network === 'null' ? '{}' : network) || '{}'
      let { edges: targetEdges, nodes: targetNodes } = JSON.parse(network)
      this.dispatch(
        actions.setPageState({ params: this.getParams(), name, targetEdges, targetNodes, url }),
        actions.setDuration({ time_left: time_left * 60 })
      );
    });
  }

  componentWillUnmount() {
    window.onbeforeunload = null
  }

  renderStatusLabel(status) {
    return <div className={`experiment-status ${status}`} />
  }

  renderButton() {
    return <Button style={{ float: 'right' }} size="small">开启实验场景</Button>
  }

  clickNode = (server_id, showMenu, hideMenu) => {
    let node = this.props.targetNodes.find(item => item.id === server_id) || {};
    let serverIp = (this.props.ips.find(item => item.server_id === server_id) || {}).ip;
    if (!TOPO_ENABLE_TYPES.includes(node.detail_type) || !server_id || getUserExperimentStorage(USER_EXPERIMENT_STATUS, this.props.match.params.rid) !== 'CreateComplete') {
      hideMenu();
      return;
    }

    this.dispatch(actions.setPageState({ is_window: node.os_type === '2', node, serverIp }));
    showMenu();
    // api.experimentVNC({ ...this.getParams(), server_id, user_experiment_id: getUserExperimentStorage(USER_EXPERIMENT_IDS, this.props.match.params.rid)}).then(({ vnc_url = '' }) => {
    //   let serverIp = (this.props.ips.find(item => item.server_id === server_id) || {}).ip;
    //   this.dispatch(actions.setPageState({ serverIp, serverUrl: vnc_url, is_window: node.os_type === '2', node }));
    //   showMenu();
    // })
  }

  isOperateDevice = (node_role) => node_role === '1'

  renderMenu = () => {
    let { node: { username, pwd, node_role, id: server_id } } = this.props;
    let { resource_id, course_id, __role } = this.getParams()
    let user_experiment_id = getUserExperimentStorage(USER_EXPERIMENT_IDS, resource_id)
    return <Menu>
      <Menu.Item>
        <div className="topo-tooltip">
          <div>
            <p><span>&emsp;&emsp;IP:</span> {this.props.serverIp}</p>
            {this.isOperateDevice(node_role) && <div>
              <p><span>用户名:</span> {username}</p>
              <p><span>&emsp;密码:</span> {pwd}</p>
              <div style={{ textAlign: 'center' }}>
                <Button disabled={!this.props.serverIp} size="small" onClick={() => {
                  let win = window.open(`/vnc/${resource_id}/${course_id}/${server_id}/${user_experiment_id}/${__role}/${this.props.is_window ? 1 : 2}`)
                  this.dispatch(actions.setPageState({ 'open_windows': this.props.open_windows.concat(win) }))
                }}
                >登录终端</Button></div>
            </div>}
          </div>
        </div>
      </Menu.Item>
    </Menu>
  }

  render() {
    let { experiment_status, url } = this.props;
    return (
      <div className="experiment-wrapper">
        <Rnd style={{
          position: 'relative',
          minWidth: '25%'
        }}
          default={{
            width: '25%',
            minWidth: '25%'
          }}
        >
          <div className="experiment_sider">
            <Sider url={url} />
          </div>
        </Rnd>

        <div className="experiment_content">
          <Row className="experiment-operate-row">
            <Col span="12">
              <div className={`experiment-status ${experiment_status}`}>{this.props.loadingProgress >= 5 && experiment_status === Creating && <span>实验载入中，进度：<span style={{ display: 'inline-block', width: '16px' }}>{this.props.loadingProgress % 1 === 0 ? this.props.loadingProgress : this.props.loadingProgress}</span> %</span>}</div>
            </Col>
            <Col span="12">
              {/* {this.renderButton()} */}
            </Col>
          </Row>
          <ExperimentScene
            {...this.state}
            {...this.props}
            setTopoNetwork={network => this.dispatch(actions.setPageState({ network }))}
            readOnly
            static={getUserExperimentStorage(USER_EXPERIMENT_STATUS, this.props.match.params.rid) !== 'CreateComplete'}
            renderMenu={this.renderMenu}
            onClick={this.clickNode}
          />
        </div>
      </div>
    );
  }
}).connect(state => {
  let { experiment_status, serverIp, node = {}, selectedNode, name, serverUrl, targetEdges = [], targetNodes = [], url = '', network = {}, is_window, ips = [], open_windows = [], loadingProgress = 5 } = state.page;
  return {
    is_window,
    targetEdges,
    targetNodes,
    node,
    open_windows,
    url,
    ips,
    name,
    network,
    serverIp,
    serverUrl,
    selectedNode,
    loadingProgress,
    experiment_status,
    status: state.experiment.status,
  }
})
