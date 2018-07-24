import React from 'react'
import Base from 'common/base'
import api from 'common/api';
import actions from 'system/actions/topo';
import FormModal from 'common/page/form-modal';
import Breadcrumb from 'common/breadcrumb';
import { Form, Input } from 'antd';
import { Select2 } from 'common/select'
import { TargetIconBlock } from 'common/target-icon';
import Target from './target';
import Alert from 'common/alert';
import { DEFAULT_TARGET_NODES, DEFAULT_TARGET_EDGES, TARGET_CONNECT_TYPE, TARGET_CONNECT_DETAIL } from 'common/config';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
// import ExperimentScene from 'co/mmon/experiment-scene';
import { TOPO_ENABLE_TYPES, NODE_ROLE } from 'common/config'
import Content from './content'
import './style.less';

const FormItem = (label, children) => <Form.Item label={label} labelCol={{ span: 4 }} wrapperCol={{ col: 4 }}>{children}</Form.Item>

export default DragDropContext(HTML5Backend)(class extends Base {
  buttons = [
    // <Select2 showSearch options={[]} getValue={({ id }) => `${id}`} getLabel={({ value }) => value} />,
  ]

  componentDidMount = async () => {
    let detail = await api.systemExperimentDetail({ experiment_id: this.props.match.params.id });
    const { project_id } = detail
    let { list: targetList } = await api.systemTargetListAll({ project_id });
    let { nodes: targetNodes, edges: targetEdges } = detail.network ? JSON.parse(detail.network) : { nodes: DEFAULT_TARGET_NODES, edges: DEFAULT_TARGET_EDGES };
    this.dispatch(actions.initTopo({ targetEdges, targetNodes }));
    this.dispatch(actions.initPage({ targetList }));
    this.dispatch(actions.setState({ project_id }))
  }

  componentWillUnmount() {
    this.dispatch(actions.initTopo({}))
  }

  renderOptions = () => {
    return ([
      {
        field: 'project_name',
        formItemProps: {
          label: '所属项目',
        },
        renderItem() {
          return <Input disabled />
        }
      },
      {
        field: 'node_role',
        formItemProps: {
          label: '节点角色'
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '节点角色不能为空' },
          ]
        },
        renderItem({ props }) {
          return <Select2 options={NODE_ROLE} getValue={({ value }) => `${value}`} getLabel={({ label }) => label} onSelect={(_, opt) => props.form.setFieldsValue({ nodotype: opt.props.option })} />
        }
      },
      {
        field: 'mirrid',
        formItemProps: {
          label: '镜像ID',
        },
        renderItem() {
          return <Input disabled />
        }
      },
      {
        field: 'os_type',
        hasPopupContainer: true,
        formItemProps: {
          label: '系统类型',
        },
        renderItem({ state: { config } }) {
          return <Select2 disabled showSearch options={config.os_type} getValue={({ id }) => `${id}`} getLabel={({ value }) => value} />
        }
      },
      {
        field: 'os',
        formItemProps: {
          label: '操作系统',
        },
        hasPopupContainer: true,
        renderItem({ state: { config } }) {
          return <Select2 showSearch options={config.os} getValue={({ id }) => `${id}`} getLabel={({ value }) => value} />
        }
      },
      {
        field: 'mirr_config',
        hasPopupContainer: true,
        formItemProps: {
          label: '镜像大小',
        },
        renderItem({ state: { config } }) {
          return <Select2 showSearch options={config.mirr_config} getValue={({ id }) => `${id}`} getLabel={({ value }) => value} />
        }
      },
      {
        render({ props, state }) {
          return [
            <Form.Item key="1" style={{ display: 'inline-block', width: '36%' }} label="访问方式" labelCol={{ span: 11 }} wrapperCol={{ span: 13 }}>
              {props.form.getFieldDecorator('connect_type', { initialValue: state.model.connect_type })(<Select2 disabled showSearch options={TARGET_CONNECT_TYPE} getValue={({ value }) => `${value}`} getLabel={({ label }) => label} onSelect={(val) => props.form.setFieldsValue({ port: val === '1' ? '3389' : '22', connect_type_detail: '' })} />)}
            </Form.Item>,
            <Form.Item key="2" style={{ display: 'inline-block', width: '30%', margin: '0 2%' }} wrapperCol={{ span: 24 }}>
              {props.form.getFieldDecorator('port', { initialValue: state.model.port })(<Input />)}
            </Form.Item>,
            <Form.Item key="3" style={{ display: 'inline-block', width: '26%' }} wrapperCol={{ span: 24 }}>
              {props.form.getFieldDecorator('connect_type_detail', { initialValue: state.model.connect_type_detail })(props.form.getFieldValue('connect_type') === '1' ? <Select2 showSearch options={TARGET_CONNECT_DETAIL} getValue={({ value }) => `${value}`} getLabel={({ label }) => label} /> : <div />)}
            </Form.Item>
          ];
        }
      },
      {
        render({ props, state }) {
          return [
            <Form.Item key="1" label="用户信息" style={{ display: 'inline-block', width: '50%', marginRight: '2%' }} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {props.form.getFieldDecorator('username', {
                initialValue: state.model.username,
                validateTrigger: 'onBlur',
                rules: [
                  { pattern: /^\w{2,20}$/, message: '用户名长度不合法，应为2-20位' },
                  { pattern: /^\w*[a-zA-z_]\w*$/, message: '用户名格式不合法，应为字母、数字、下划线的组合，不能为纯数字,纯下划线' },
                  {
                    validator: (_, value, cb) => {
                      if (['root', 'ops', 'administrator'].includes(value)) {
                        cb('用户名不能为root, ops, administrator')
                      }
                      if (/^_+$/.test(value)) {
                        cb('用户名不能全为下划线')
                      }
                      cb();
                    }
                  }]
              })(<Input />)}
            </Form.Item>,
            <Form.Item key="2" style={{ display: 'inline-block', width: '44%' }}>
              {props.form.getFieldDecorator('pwd', {
                initialValue: state.model.pwd,
                validateTrigger: 'onBlur',
                rules: [{
                  pattern: /^\S{8,30}$/, message: '密码长度不合法，应为8-30位'
                }, {
                  validator: (_, value, cb) => {
                    let pattern1 = /[a-z]+/.test(value),
                        pattern2 = /[A-Z]+/.test(value),
                        pattern3 = /[0-9]+/.test(value),
                        pattern4 = /[`~!@#$%*()-+=_{}\[\];',.?\/]+/.test(value)
                    if (/^\S{8,30}$/.test(value) && (pattern1 + pattern2 + pattern3 + pattern4) < 3) {
                      cb('密码必须包含大，小写字母，数字，特殊字符中的三项')
                    }
                    cb();
                  }
                }] })(<Input type="password" />)}
              </Form.Item>,
          ];
        }
      }].map(item => ({ ...item, condition: this.isEnableTypes }))
    );
  }

  isEnableTypes = ({ props, model }) => {
    let value = props.form.getFieldValue('detail_type') || model.detail_type
    return TOPO_ENABLE_TYPES.includes(value)
  }

  targetModelFields = [
    {
      field: 'id',
      render({ props, state }) {
        return props.form.getFieldDecorator('id', { initialValue: state.model.id })(<div />)
      }
    },
    {
      field: 'target_id',
      render({ props, state }) {
        return props.form.getFieldDecorator('target_id', { initialValue: state.model.target_id })(<div />)
      }
    },
    {
      field: 'name',
      formItemProps: {
        label: '标靶名称',

      },
      fieldDecorator: {
        rules: [
          { required: true, message: '标靶名称不能为空' },
        ],
      },
    },
    {
      field: 'type',
      render({ props, state }) {
        return props.form.getFieldDecorator('type', { initialValue: state.model.type })(<div />)
      }
    },
    {
      render({ props, state: { config, model } }) {
        return <Form.Item label="标靶类型" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
          {props.form.getFieldDecorator('detail_type', { initialValue: model.detail_type })(
            <Select2 options={config.type} getOptionModel={({ type }) => type} getValue={({ id }) => `${id}`} getLabel={({ value }) => value} onSelect={(_, opt) => props.form.setFieldsValue({ type: opt.props.option })} />)
          }
        </Form.Item>
      }
    },
    {
      render({ props }) {
        return FormItem('标靶图标', props.form.getFieldValue('detail_type') && <TargetIconBlock type={props.form.getFieldValue('detail_type')} title={props.form.getFieldValue('name')} />)
      }
    },
    // {
    //   render({ props, state: { model } }) {
    //     return <Form.Item label="节点角色" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
    //       {props.form.getFieldDecorator('node_role', { initialValue: model.node_role })(
    //         <Select2 options={NODE_ROLE} getValue={({ value }) => `${value}`} getLabel={({ label }) => label} onSelect={(node_role) => props.form.setFieldsValue({ node_role })}/>)
    //       }
    //     </Form.Item>
    //   }
    // },
    ...this.renderOptions()
  ]

  initTarget = async ({ modalParams }) => {
    const { project_id } = this.props
    var config = await api.systemTargetGetSelect();
    var model = await api.systemTargetDetail({ target_id: modalParams.target_id, project_id })
    model.node_role = '1'
    model.project_name = (config.projects.find(v => v.id === model.project_id) || {}).name
    return {
      config,
      model
    }
  }

  initEditTarget = async ({ modalParams }) => {
    const { project_id } = this.props
    var config = await api.systemTargetGetSelect();
    const model = this.props.targetNodes.find(item => item.id === modalParams.id)
    // model.project_name = (config.projects.find(v => v.id === model.project_id) || {}).name
    return {
      config,
      model: { ...model, project_id }
    }
  }
  onAddNodeSubmit = (criteria) => {
    this.dispatch(actions.addNode({ ...criteria, id: criteria.id || `${criteria.target_id}-${this.props.targetNodes.filter(node => node.detail_type === criteria.detail_type).length + 1}` }));
    this.dispatch(actions.hideModal('target'));
  }
  onEditNodeSubmit = (criteria) => {
    this.dispatch(actions.editNode(criteria))
    this.dispatch(actions.hideModal('edit'));
  }
  onDragEnd = (item) => {
    this.dispatch(actions.showModal('target', item));
  }
  onEditNode = () => {
    this.dispatch(actions.showModal('edit', { id: this.props.selectedNode }))
  }
  onDoubleClickEdit = (selectedNode) => {
    this.dispatch(actions.showModal('edit', { id: selectedNode }))
  }
  onDeleteNode = () => {
    this.dispatch(actions.deleteNode(this.props.selectedNode))
  }
  onAddEdge = (edgeData) => {
    this.dispatch(actions.addEdge(edgeData))
  }
  onDeleteEdge = () => {
    this.dispatch(actions.deleteEdge(this.props.selectedEdge))
  }

  // getTopoConfig = () => {
  //   [{
  //     type: 'server', enableNodes: ['network'], network
  //   }]
  // }
  handleTopoSubmit = () => {
    let { targetEdges, targetNodes } = this.props;
    api.systemExperimentUpdateTopo({
      experiment_id: this.props.match.params.id,
      topo: JSON.stringify({ servers: targetNodes.filter(item => TOPO_ENABLE_TYPES.includes(item.detail_type)) }),
      network: JSON.stringify({ edges: targetEdges, nodes: targetNodes })
    }).then(() => {
      Alert.success('拓扑编辑成功');
      this.props.history.push('/experiment');
    })
  }
  setTopoNetwork = (network) => {
    this.dispatch(actions.setTopoNetwork(network))
  }
  render() {
    return (
      <FormModal
        isPage
        title={<Breadcrumb />}
        modelFields={[]}
        action={actions}
        btn={this.buttons}
        onSave={this.handleTopoSubmit}
        onCancel={() => this.props.history.push('/experiment')}
      >
        <div className="topo-component__container">
          <div className="topo-component__sider">
            <div className="icon-wall">
              {(this.props.targetList || []).map((item, key) =>
                <Target key={key} target={item} name={item.name} onDragEnd={() => this.onDragEnd(item)} />
              )}
            </div>
          </div>
          <div className="topo-component__content">
            <Content
              {...this.props}
              network={this.props.network}
              actions={actions}
              onAddNode={this.onAddNodeSubmit}
              onEditNode={this.onEditNode}
              onDoubleClickEdit={this.onDoubleClickEdit}
              onDeleteNode={this.onDeleteNode}
              onAddEdge={this.onAddEdge}
              onDeleteEdge={this.onDeleteEdge}
              onSetSelectedNode={node => this.dispatch(actions.setSelectedNode(node))}
              onSetSelectedEdge={edge => this.dispatch(actions.setSelectedEdge(edge))}
              setTopoNetwork={this.setTopoNetwork}
            />
          </div>
        </div>
        <FormModal
          name="target"
          title="编辑节点"
          className="topo-target-detail-modal"
          initState={this.initTarget}
          modelFields={this.targetModelFields}
          onCancel={() => this.dispatch(actions.hideModal('target'))}
          onSave={this.onAddNodeSubmit}
        />
        <FormModal
          name="edit"
          title="编辑节点"
          className="topo-target-detail-modal"
          initState={this.initEditTarget}
          modelFields={this.targetModelFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={this.onEditNodeSubmit}
        />
      </FormModal>
    )
  }
}).connect((state) => {
  let { targetList } = state.page;
  let { targetNodes = [], targetEdges = [], selectedNode = '', network = {}, selectedEdge = '', project_id = '' } = state.topo;
  return {
    targetList: (targetList || []).filter(item => item.status == '1').sort((c, n) => n.detail_type < c.detail_type),
    targetNodes,
    targetEdges,
    selectedNode,
    selectedEdge,
    network,
    project_id
  };
})

