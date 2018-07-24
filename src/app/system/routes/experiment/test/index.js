import React from 'react'
import Base from 'common/base'
import api from 'common/api'
import { Button } from 'common/button'
import FormModal from 'common/page/form-modal';
import Breadcrumb from 'common/breadcrumb';
import actions from 'system/actions/experiment'
import ExperimentScene from 'common/experiment-scene'
import { Menu, Col, Row } from 'antd';
import Alert from 'common/alert'
import { ADMIN_EXPERIMENT_STATUS, ADMIN_EXPERIMENT_START_TIME, TOPO_ENABLE_TYPES, ADMIN_EXPERIMENT_IDS, EXPERIMENT_WORK_STATUS } from 'common/config'
const { Creating, CreateComplete, Deleting, /*CreateFailed,  DeleteFailed*/ } = EXPERIMENT_WORK_STATUS;

import './style.less';
const getAdminExperimentStorage = (cate, id) => {
  let ids = JSON.parse(localStorage.getItem(cate) || '{}')
  return id ? ids[id] : ids
}
export default (class extends Base {
  keepAliveTimer = ''
  progressTimer = ''
  getParams = () => {
    let { id: experiment_id } = this.props.match.params;
    return { experiment_id }
  }

  componentDidMount() {
    window.onbeforeunload = function () {
      return false;
    };
    api.systemExperimentDetail(this.getParams()).then(({ network, url, name }) => {
      let { edges: targetEdges, nodes: targetNodes } = JSON.parse(network || '{}')
      this.dispatch(actions.setPageState({ params: this.getParams(), name, targetEdges, targetNodes, url }));
    });
    this.experimentDetialPooling({ experiment_id: this.props.match.params.id })
  }

  componentWillUnmount() {
    window.onbeforeunload = null
    clearTimeout(this.keepAliveTimer)
  }

  renderStatusLabel(status) {
    return <div className={`experiment-status ${status}`} />
  }

  renderButton(status) {
    return [
      <Button key="start" disabled={!this.props.targetNodes.length || status === Creating || status === CreateComplete} style={{ float: 'right' }} size="small" onClick={this.startExperiment}>开启实验场景</Button>,
      <Button key="stop" disabled={status !== CreateComplete && status !== 'UpdateFailed' && status !== 'CreateFailed'} style={{ float: 'right', marginRight: 10 }} type="danger" size="small" onClick={this.stopExperiment}>关闭实验场景</Button>
    ]
  }

  storeAdminExperimentStorage = (cate, value) => {
    let ids = this.getAdminExperimentStorage(cate)
    localStorage.setItem(cate, JSON.stringify({ ...ids, [this.props.match.params.id]: value }))
  }

  getAdminExperimentStorage = (cate, id) => {
    let ids = JSON.parse(localStorage.getItem(cate) || '{}')
    return id ? ids[id] : ids
  }

  startExperiment = () => {
    this.changeExperimentStatus(Creating);
    api.systemExperimentCreateScene(this.getParams()).then(({ user_experiment_id }) => {
      Alert.info('实验创建中');
      this.storeAdminExperimentStorage(ADMIN_EXPERIMENT_START_TIME, Date.now())
      this.storeAdminExperimentStorage(ADMIN_EXPERIMENT_IDS, user_experiment_id);
      this.experimentDetialPooling({ ...this.getParams(), user_experiment_id })
      this.handleProgress()
    }, () => this.changeExperimentStatus(''))
  }

  setProgress = () => {
    let timestamp = this.getAdminExperimentStorage(ADMIN_EXPERIMENT_START_TIME, this.props.match.params.id)
    let experiment_start_duration = Math.round((Date.now() - timestamp) / 1000);
    if (experiment_start_duration >= 62) {
      this.dispatch(actions.setPageState({ loadingProgress: 98 }))
    }
    if (this.props.loadingProgress <= 96.5) {
      this.dispatch(actions.setPageState({ loadingProgress: 5 + Math.ceil(experiment_start_duration * 1.5) }))
    }
  }

  handleProgress = () => {
    clearTimeout(this.progressTimer)
    let { loadingProgress = 5, experiment_status } = this.props
    if (!loadingProgress) {
      this.dispatch(actions.setPageState({ loadingProgress: 0 }))
    }
    if (loadingProgress < 98 && experiment_status === Creating) {
      this.setProgress()
      this.progressTimer = setTimeout(() => this.handleProgress(), 1000)
    }
    if (loadingProgress > 98 || experiment_status !== Creating) {
      // this.storeAdminExperimentStorage(ADMIN_EXPERIMENT_START_TIME, 0)
      this.dispatch(actions.setPageState({ loadingProgress: 0 }))
    }
  }


  stopExperiment = () => {
    api.systemExperimentStopScene(this.getParams()).then(() => {
      let user_experiment_id = this.getAdminExperimentStorage(ADMIN_EXPERIMENT_IDS, this.props.match.params.id)
      Alert.info('实验停止中');
      this.changeExperimentStatus(Deleting);
      this.experimentDetialPooling({ ...this.getParams(user_experiment_id) })
    })
  }

  experimentDetialPooling = (data) => {
    var timer = setTimeout(() => {
      this.getExperimentDetail(data, timer)
    }, 2000)
  }

  keepAlive = () => {
    api.systemExperimentKeepAlive(this.getParams()).then(({ is_delete }) => {
      if (is_delete) {
        Alert.info('实验已被后台中止');
        return this.stopExperiment()
      }
      this.keepAliveTimer = setTimeout(() => {
        clearTimeout(this.keepAliveTimer)
        if (this.getAdminExperimentStorage(ADMIN_EXPERIMENT_STATUS, this.props.match.params.id) === CreateComplete) {
          this.keepAlive();
        }
      }, 10000);
    })
  }

  getExperimentDetail = (data, timer) => {
    clearTimeout(timer);
    api.systemExperimentSceneDetail(data).then(({ status, ips }) => {
      this.changeExperimentStatus(status);
      this.dispatch(actions.setPageState({ ips }))
      if (status === Creating || status === Deleting) {
        this.experimentDetialPooling(data)
      }
      if (status === Creating) {
        this.handleProgress();
      }
    });
  }

  changeExperimentStatus = (status) => {
    this.dispatch(actions.setPageState({ experiment_status: status }))
    if (status) {
      this.storeAdminExperimentStorage(ADMIN_EXPERIMENT_STATUS, status)
      if (status === CreateComplete) {
        this.keepAlive();
      }
    } else if (!status && this.getAdminExperimentStorage(ADMIN_EXPERIMENT_STATUS, this.props.match.params.id)) {
      this.storeAdminExperimentStorage(ADMIN_EXPERIMENT_STATUS, '')
    }
  }

  isOperateDevice = (node_role) => node_role === '1'

  renderMenu = () => {
    let { node: { username, pwd, node_role, id: server_id } } = this.props;
    return <Menu>
      <Menu.Item>
        <div className="topo-tooltip">
          <div>
            <p>IP: {this.props.serverIp}</p>
            {this.isOperateDevice(node_role) && <div>
              <p>用户名: {username}</p>
              <p>密码: {pwd}</p>
              <Button disabled={!this.props.serverIp} size="small" onClick={() => {
                window.open(`/vnc/1/1/${server_id}/${this.props.match.params.id}/16/${this.props.is_window ? 1 : 2}`)
                // this.dispatch(actions.setPageState({ 'open_windows': this.props.open_windows.concat(win) }))
              }}
              >登录终端</Button>
            </div>}
          </div>
        </div>
      </Menu.Item>
    </Menu>
  }

  clickNode = (server_id, showMenu, hideMenu) => {
    let node = this.props.targetNodes.find(item => item.id === server_id) || {};
    let serverIp = (this.props.ips.find(item => item.server_id === server_id) || {}).ip;
    if (!TOPO_ENABLE_TYPES.includes(node.detail_type) || !server_id || getAdminExperimentStorage(ADMIN_EXPERIMENT_STATUS, this.props.match.params.id) !== 'CreateComplete') {
      hideMenu();
      return;
    }
    this.dispatch(actions.setPageState({ serverIp, is_window: node.os_type === '2', node }));
    showMenu();
  }

  render() {
    let { experiment_status } = this.props;
    return (
      <FormModal
        isPage
        title={<Breadcrumb />}
        modelFields={[]}
        onSave={this.handleTopoSubmit}
        onCancel={() => this.props.history.push('/experiment')}
      >
        <div className="experiment_content">
          <Row className="experiment-operate-row">
            <Col span="12">
              <div className={`experiment-status ${experiment_status}`}>{this.props.loadingProgress >= 5 && experiment_status === Creating && <span>实验载入中，进度：<span style={{ display: 'inline-block', width: '16px' }}>{this.props.loadingProgress % 1 === 0 ? this.props.loadingProgress : this.props.loadingProgress}</span> %</span>}</div>
            </Col>
            <Col span="12">
              {this.renderButton(experiment_status)}
            </Col>
          </Row>
          <ExperimentScene
            {...this.state}
            {...this.props}
            setTopoNetwork={network => this.dispatch(actions.setPageState({ network }))}
            readOnly
            renderMenu={this.renderMenu}
            onClick={this.clickNode}
          />
        </div>
      </FormModal>
    )
  }
}).connect(state => {
  let { experiment_status, serverIp, node = {}, selectedNode, name, serverUrl, targetEdges = [], targetNodes = [], url = '', network = {}, is_window, ips = [], loadingProgress = 5 } = state.page;
  // let experiment_status = getAdminExperimentStorage(ADMIN_EXPERIMENT_STATUS, params.resource_id)
  return {
    is_window,
    targetEdges,
    targetNodes,
    node,
    url,
    ips,
    name,
    network,
    serverIp,
    serverUrl,
    selectedNode,
    loadingProgress,
    experiment_status,
  }
})
