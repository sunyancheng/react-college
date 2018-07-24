import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-breadcrumb'
import actions from 'system/actions/role'
import { BtnGroup, Btn } from 'common/button-group'
import FormModal from 'common/page/form-modal'
import ConfirmModal from 'common/page/confirm-modal'
import { IconButton } from 'common/button'
import { Row, Col } from 'antd'
import CheckboxGroup2 from 'common/checkbox-group2'
import { cachedApi } from 'common/api'
import Tree2 from 'common/tree2'


export default (class extends Base {
  columns = [
    {
      title: '角色ID',
      dataIndex: 'role_id'
    }, {
      title: '角色名称',
      dataIndex: 'name'
    }, {
      title: '创建时间',
      dataIndex: 'ctime'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          (data.role_id != '1') && <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >编辑</Btn>
            <Btn type="danger" onClick={() => { this.dispatch(actions.showModal('delete', data)) }} >删除</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  modelFields = [
    {
      field: 'name',
      formItemProps: {
        label: '角色名称'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '角色名称不能为空' },
        ],
      },
    },
    {
      render({ state, setState }) {
        const { menuActions, selectedNode = {} } = state

        const onCheck = (checkedKeys, e) => {
          const { checked, node } = e;
          const recursiveCheck = (node, result) => {
            [].concat(node).forEach(node => {
              delete result[node.menu_id]
              if (checked) {
                result[node.menu_id] = node.actions.map(a => a.action_id)
              }
              recursiveCheck(node.children, result)
            })

            return result
          }
          let m = recursiveCheck(node.props.data, { ...menuActions })
          setState({ menuActions: m })
        }

        return (
          <Row gutter={20} style={{ marginBottom: 20 }}>
            <Col span={16}>
              <Tree2
                value={Object.keys(menuActions)}
                onChange={onCheck}
                onSelect={(a, e) => setState({ selectedNode: e.node.props.data })}
                options={state.menus}
                getLabel={i => i.name} getValue={i => i.menu_id}
                checkStrictly
              />
            </Col>
            <Col span={8}>
              <div className="tree2">
                <CheckboxGroup2
                  options={selectedNode.actions || []}
                  getValue={i => i.action_id}
                  getLabel={i => i.name}
                  onChange={checkedValue => setState({ menuActions: { ...menuActions, [selectedNode.menu_id]: checkedValue } })}
                />
              </div>
            </Col>
          </Row >
        )
      }
    },
    {
      field: 'memo',
      formItemProps: {
        label: '备注'
      }
    },
  ]

  buttons = [
    <IconButton key={1} icon={'add'} onClick={() => this.dispatch(actions.showModal('add'))} size={'small'}>新建</IconButton>
  ]

  initState = ({ modalParams }) => cachedApi.systemMenuList().then(menus => {
    var menuActions = {}
    if (modalParams) {
      try {
        menuActions = JSON.parse(modalParams.menu_actions).reduce((obj, item) => {
          obj[item.menu_id] = item.action_ids
          return obj
        }, {})
      } catch (e) {
        console.log('parse menu action failed')
        menuActions = {}
      }
    }
    return ({ menus, model: modalParams, menuActions })
  })

  parse = (criteria, modalParams, { menuActions }) => {
    var data = {
      ...criteria,
      menu_actions: JSON.stringify(Object.keys(menuActions).map(menu_id => ({ menu_id, action_ids: menuActions[menu_id] })))
    }
    // 编辑
    if (modalParams) {
      data.role_id = modalParams.role_id;
    }
    return data;
  }

  render() {
    return (
      <Page
        title="角色列表"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.role_id}
      >
        <FormModal
          title="新建角色"
          name="add"
          modelFields={this.modelFields}
          initState={this.initState}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={(...args) => this.dispatch(actions.add(this.parse(...args)))}
          width={620}
        />

        <FormModal
          title="编辑角色"
          name="edit"
          modelFields={this.modelFields}
          initState={this.initState}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={(...args) => this.dispatch(actions.edit(this.parse(...args)))}
          width={620}
        />
        <ConfirmModal
          title="删除角色"
          name="delete"
          onCancel={() => this.dispatch(actions.hideModal('delete'))}
          onSave={({ role_id }) => this.dispatch(actions.delete({ role_id }))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
