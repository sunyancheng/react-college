import React from 'react'
import './style.less';
import Base from 'common/base'
import Logo from 'common/logo'
import UserInfo from 'common/user-info'
import { Button } from 'common/button'
import actions from '../../actions';
import ConfirmModal from 'common/page/confirm-modal'
import api from 'common/api'
import Alert from 'common/alert'
import { Popover } from 'antd'
import { EXPERIMENT_WORK_STATUS } from 'common/config';
import ExperimentScene from 'common/experiment-scene'
import  OrderCountDown ,{ CountDown } from 'experiment/clock'
import { renderTime } from 'common/time'
import { USER_EXPERIMENT_IDS, USER_EXPERIMENT_STATUS, USER_EXPERIMENT_START_TIME } from 'common/config'
import { DELAY_DURATION, KEEP_ALIVE_INTERVAL, DETAIL_POLLING_INTERVAL } from '../../config'

const { Creating, CreateComplete, Deleting, UpdateFailed /*CreateFailed,  DeleteFailed*/ } = EXPERIMENT_WORK_STATUS;

class Header extends Base {

  keepAliveTimer = ''
  detailTimer = ''
  progressTimer = ''

  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    clearTimeout(this.keepAliveTimer)
    clearTimeout(this.detailTimer)
    clearTimeout(this.progressTimer)
  }

  componentWillReceiveProps(nextProps) {
    let { delayed_times, time_left, params: { resource_id } } = nextProps;
    if (!!time_left && !this.Clock) this.Clock = new OrderCountDown(1000, nextProps.time_left)
    if (resource_id !== this.props.params.resource_id) {
      if (this.getUserExperimentID(nextProps) && resource_id) {
        this.experimentDetialPooling({}, nextProps, true)
      }
    }
    if (time_left !== this.props.time_left || this.props.timeForClosing !== nextProps.timeForClosing) {
      this.handleTimeLeft({ delayed_times, time_left }, nextProps);
    }
  }

  experimentDetialPooling = (opt = { user_experiment_id: '' }, props = this.props, isFirst = false) => {
    clearTimeout(this.detailTimer);
    this.detailTimer = null;
    let { user_experiment_id } = opt
    let params = this.getParams(user_experiment_id, props)
    api.experimentSceneDetail(params).then(({ status, ips, is_delete }) => {
      if (is_delete && !isFirst) {
        // this.closeAllVncWindow();
        Alert.info('实验已被后台中止');
        this.changeExperimentStatus('')
        this.Clock.resetDuration();
        CountDown.resetDuration();
        this.dispatch(actions.setPageState({ loadingProgress: 0 }))
        return;
      }
      this.changeExperimentStatus(status);
      this.dispatch(actions.setPageState({ ips }))
      if (status === Creating || status === Deleting) {
        this.detailTimer = setTimeout(() => {
          this.experimentDetialPooling({ user_experiment_id: params.user_experiment_id })
        }, DETAIL_POLLING_INTERVAL * 1000)
      }
      if (status === Creating) {
        this.handleProgress();
      }
    }, () => {
      this.storeUserExperimentStatus(UpdateFailed);
      this.changeExperimentStatus(UpdateFailed);
    });
  }

  getParams = (user_experiment_id, props = this.props) => {
    let { resource_id, course_id, __role } = props.params;
    return {
      __role,
      resource_id,
      course_id,
      user_experiment_id: user_experiment_id || this.getUserExperimentID(props)
    }
  }

  keepAlive = (status = this.getUserExperimentStatus()) => {
    clearTimeout(this.keepAliveTimer)
    this.keepAliveTimer = null
    api.experimentKeepAlive(this.getParams()).then(({ delayed_times, time_left, is_delete }) => {
      if (is_delete) {
        this.closeAllVncWindow();
        Alert.info('实验已被后台中止');
        this.changeExperimentStatus('')
        this.Clock.resetDuration();
        CountDown.resetDuration();
        clearTimeout(this.keepAliveTimer)
        this.dispatch(actions.setPageState({ loadingProgress: 0 }))
        return;
      }
      this.handleTimeLeft({ time_left, delayed_times })
      this.Clock.setDuration(time_left);
      this.dispatch(actions.setPageState({ delayed_times, time_left, experiment_status: status }))
      this.keepAliveTimer = setTimeout(() => {
        if (status === CreateComplete && !is_delete) {
          this.keepAlive();
        }
      }, KEEP_ALIVE_INTERVAL * 1000);
    })
  }

  closeAllVncWindow = () => {
    this.props.open_windows.forEach(win => win.close())
  }

  startExperiment = () => {
    api.experimentStart(this.getParams()).then(({ user_experiment_id }) => {
      Alert.info('实验创建中');
      this.changeExperimentStatus(Creating);
      this.storeUserExperimentStorage(USER_EXPERIMENT_START_TIME, Date.now())
      this.storeUserExperimentIDS(user_experiment_id);
      this.experimentDetialPooling({ user_experiment_id })
      this.handleProgress()
    }, this.handleOperateFailed)
  }

  setProgress = () => {
    let timestamp = this.getUserExperimentStorage(USER_EXPERIMENT_START_TIME, this.props.params.resource_id)
    let experiment_start_duration = Math.round((Date.now() - timestamp) / 1000);
    if (experiment_start_duration >= 62) {
      this.dispatch(actions.setPageState({ loadingProgress: 98 }))
    }
    if (this.props.loadingProgress <= 96.5) {
      this.dispatch(actions.setPageState({ loadingProgress: 5 + Math.ceil(experiment_start_duration * 1.5) }))
    }
  }

  handleProgress = () => {
    let { loadingProgress = 5, experiment_status } = this.props
    if (!loadingProgress) {
      this.dispatch(actions.setPageState({ loadingProgress: 0 }))
    }
    if (loadingProgress < 98 && experiment_status === Creating) {
      this.setProgress()
      this.progressTimer = setTimeout(() => this.handleProgress(), 1000)
    }
    if (loadingProgress >= 98 || experiment_status !== Creating) {
      clearTimeout(this.progressTimer)
      // this.storeUserExperimentStorage(USER_EXPERIMENT_START_TIME, 0)
      this.dispatch(actions.setPageState({ loadingProgress: 98 }))
    }
  }

  restartExperiment = () => {
    api.experimentRestart(this.getParams()).then(() => {
      Alert.info('实验重启中');
      this.Clock.resetDuration();
      this.storeUserExperimentStorage(USER_EXPERIMENT_START_TIME, 0)
      this.dispatch(actions.setPageState({ loadingProgress: 0 }))
      this.changeExperimentStatus(Creating);
      this.experimentDetialPooling()
    }, this.handleOperateFailed)
  }

  stopExperiment = () => {
    this.closeAllVncWindow();
    this.changeExperimentStatus(Deleting);
    api.experimentStop(this.getParams()).then(() => {
      Alert.info('实验停止中');
      this.Clock.resetDuration();
      CountDown.resetDuration();
      clearTimeout(this.keepAliveTimer)
      this.storeUserExperimentStorage(USER_EXPERIMENT_START_TIME, 0)
      this.dispatch(actions.setPageState({ loadingProgress: 0 }))
      // this.changeExperimentStatus(Deleting);
      this.experimentDetialPooling(this.getParams(), this.props, true)
    }, this.handleOperateFailed)
  }
  delayExperiment = () => {
    this.changeExperimentStatus('Delaying');
    api.experimentDelay(this.getParams()).then(() => {
      Alert.info('实验延时成功');
      CountDown.resetDuration();
      this.changeExperimentStatus(CreateComplete);
      this.dispatch(actions.addDuration(DELAY_DURATION))
      this.experimentDetialPooling()
    }, () => this.changeExperimentStatus(CreateComplete))
  }

  handleOperateFailed = () => {
    this.storeUserExperimentStatus('');
    this.changeExperimentStatus('');
  }

  changeExperimentStatus = (status) => {
    this.storeUserExperimentStatus(status)
    if (status === 'delete_success') {
      this.startExperiment();
    } else if (status === CreateComplete) {
      this.keepAlive();
      this.Clock.countDown()
    } else {
      this.Clock.resetDuration();
      this.dispatch(actions.setPageState({ experiment_status: status }))
    }
  }

  handleTimeLeft = ({ time_left, delayed_times }, props = this.props) => {
    let { timeForClosing, experiment_status } = props
    if (delayed_times === undefined || experiment_status !== CreateComplete) return;
    if (Number.isInteger(timeForClosing) && timeForClosing <= 0 || time_left <= 0) {
      this.dispatch(actions.hideModal('time_warning'))
      this.dispatch(actions.hideModal('time_close'))
      if (experiment_status === CreateComplete) {
        this.stopExperiment()
      }
      return;
    }
    if (time_left / 1 <= 20 && delayed_times / 1 === 3) {
      this.dispatch(actions.showModal('time_close'))
      CountDown.countDown()
    } else if (time_left / 1 <= 20) {
      this.dispatch(actions.showModal('time_warning'))
      CountDown.countDown()
    }
  }

  getUserExperimentStorage = (cate, id) => {
    let ids = JSON.parse(localStorage.getItem(cate) || '{}')
    return id ? ids[id] : ids
  }

  storeUserExperimentStorage = (cate, value, props = this.props) => {
    let ids = this.getUserExperimentStorage(cate)
    localStorage.setItem(cate, JSON.stringify({ ...ids, [props.params.resource_id]: value }))
  }

  storeUserExperimentStatus = (status) => this.storeUserExperimentStorage(USER_EXPERIMENT_STATUS, status)

  storeUserExperimentIDS = (id) => this.storeUserExperimentStorage(USER_EXPERIMENT_IDS, id)

  getUserExperimentID = (props = this.props) => this.getUserExperimentStorage(USER_EXPERIMENT_IDS, props.params.resource_id)

  getUserExperimentStatus = (props = this.props) => this.getUserExperimentStorage(USER_EXPERIMENT_STATUS, props.params.resource_id)

  allowStart(status) {
    return ![CreateComplete].includes(status);
  }

  renderStart = (status) => {
    return (
      this.allowStart(status) && <Button size="small" ghost disabled={[Creating, Deleting, 'delete_success'].includes(status)} onClick={() => this.dispatch(actions.showModal('start', {}))}>开始实验</Button>
    );
  }

  renderRestart = (status) => {
    return (
      //status === CreateComplete &&
      status === CreateComplete && <Button size="small" ghost disabled={status === Creating} onClick={() => this.dispatch(actions.showModal('restart', {}))}>重启实验</Button>
    );
  }

  renderStop = (status) => {
    return (
      <Button size="small" disabled={status !== CreateComplete && status !== 'UpdateFailed' && status !== 'CreateFailed'} ghost onClick={() => this.dispatch(actions.showModal('stop', {}))}>停止实验</Button>
    );
  }

  renderContent = () => {
    return <div>
      <p style={{ color: '#435269', marginTop: 10 }}>当前登录主机位置：<span style={{ color: '#03Ae64' }}>台式机</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;IP地址：<span style={{ color: '#03Ae64' }}>10.16.57.219</span></p>
      <ExperimentScene
        static
        {...this.props}
        renderMenu={false}
        setTopoNetwork={network => this.dispatch(actions.setPageState({ network }))}
        readOnly
        onClick={() => { }}
      />
    </div>
  }

  renderTopoGraph(status) {
    if (status !== CreateComplete) return <Button size="small" disabled ghost>实验拓扑图</Button>
    return (
      <Popover placement="bottom" content={this.renderContent()} arrowPointAtCenter>
        <span>
          <Button size="small" ghost>实验拓扑图</Button>
        </span>
      </Popover>
    );
  }

  enableDelay = () => this.props.time_left / 1 <= 600

  enableStop = () => this.props.time_left <= 0

  render() {

    let status = this.props.experiment_status || this.getUserExperimentStatus()
    return (
      <header className="experiment-header">
        <Logo platform="实训平台" />
        <div className="experiment-header-right">
          <div className="experiment-header-right-avatar">
            <UserInfo />
          </div>
          <div className="experiment-header-right-menu">
            <span className="experiment-title">{this.props.name} · 实验台</span>
            {/* {this.renderTopoGraph(status)} */}
            {this.renderStart(status)}
            {this.renderRestart(status)}
            {this.renderStop(status)}
            <span className={`timer ${this.enableDelay() ? 'danger' : ''}`}>{this.props.time_left > 0 ? renderTime(this.props.time_left) : '00:00:00'}</span>
            <Button size="small" disabled={status !== CreateComplete || !this.enableDelay() || this.props.delayed_times >= 3} onClick={() => this.dispatch(actions.showModal('delay', {}))}>延时</Button>
          </div>
        </div>
        <ConfirmModal
          title="操作提示"
          name="restart"
          message={"确认要重启实验吗？"}
          onCancel={() => this.dispatch(actions.hideModal('restart'))}
          onSave={this.restartExperiment}
        />
        <ConfirmModal
          title="操作提示"
          name="stop"
          message={"确认要停止实验吗？"}
          onCancel={() => this.dispatch(actions.hideModal('stop'))}
          onSave={this.stopExperiment}
        />
        <ConfirmModal
          title="操作提示"
          name="start"
          message={"确认要开始实验吗？"}
          onCancel={() => this.dispatch(actions.hideModal('start'))}
          onSave={this.startExperiment}
        />
        <ConfirmModal
          title="操作提示"
          name="delay"
          message={"确认要延时吗？"}
          onCancel={() => this.dispatch(actions.hideModal('delay'))}
          onSave={this.delayExperiment}
        />
        <ConfirmModal
          title="操作提示"
          name="time_warning"
          closable={false}
          saveWithCancel={false}
          footer={[
            <Button key="close" type="danger" size="small" onClick={() => {
              this.dispatch(actions.hideModal('time_warning'));
              this.stopExperiment();
            }}
            >结束实验</Button>,
            <Button key="submit" size="small" onClick={() => {
              this.delayExperiment();
              this.dispatch(actions.hideModal('time_warning'));
            }}
            >延时</Button>
          ]
          }
          message={<span>实验时间到是否延长实验时间？<span style={{ color: 'red' }}>{this.props.timeForClosing}s</span>后自动结束实验</span>}
        />
        <ConfirmModal
          title="操作提示"
          name="time_close"
          closable={false}
          message={<span>实验时间到请结束实验<span style={{ color: 'red' }}>{this.props.timeForClosing}s后自动结束实验</span></span>}
          okText="结束实验"
          saveWithCancel={false}
          footer={[
            <Button key="submit" size="small" onClick={() => {
              this.stopExperiment();
              this.dispatch(actions.hideModal('time_close'));
            }}
            >结束实验</Button>]
          }
        />
      </header>
    )
  }
}

export default (Header.withRouter()).connect((state) => {
  let { name, user_experiment_id, experiment_status, targetEdges = [], targetNodes = [], url = '', network = {}, delayed_times = '0', open_windows = [], loadingProgress = 5 } = state.page, { time_left, timeForClosing } = state.experiment;
  return {
    targetEdges,
    targetNodes,
    url,
    network,
    delayed_times,
    name,
    timeForClosing,
    open_windows,
    time_left,
    status: state.experiment.status,
    user_experiment_id,
    experiment_status,
    loadingProgress,
    params: state.page.params || {}
  }
})
