import Base from 'common/base'
import React from 'react'
import { PageLayout, PageHeader, PageContent } from 'common/page/page-layout'
import actions from 'system/actions/menu'
const { clearPage, initPage, getList, showModal, hideModal, add, edit, moveUp, moveDown } = actions
import TableTreeWrapper from 'common/table-tree-wrapper'
import AuthControl from 'system/components/auth-control'
import FormModal from 'common/page/form-modal'
import ConfirmModal from 'common/page/confirm-modal'
import { Select } from 'antd'
import Icon from 'common/icon'
const Option = Select.Option
import { BtnGroup, Btn } from 'common/button-group'

export default (class extends Base {
  state = {
    addMenuType: "",
    menuDeleteVisible: false
  }

  componentDidMount = () => {
    this.dispatch(initPage(), getList());
  }

  componentWillUnmount() {
    this.dispatch(clearPage());
  }

  addMenu = (pid = '0') => {
    console
    this.dispatch(showModal('add', { pid }));
  }

  editMenu = (data) => {
    this.dispatch(showModal('edit', data));
  }

  data = {
    rootBuilder: () => {
      return (
        <TableTreeWrapper.Row>
          <TableTreeWrapper.Column fill>功能配置</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="300">页面地址</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="120">图标</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="280">
            <AuthControl name="menu_create">
              <a onClick={() => this.addMenu()}>添加页面</a>
            </AuthControl>
          </TableTreeWrapper.Column>
        </TableTreeWrapper.Row>
      );
    },
    nodeBuilder: (data, parent, key) => {
      let prev = parent.children[key - 1] || null;
      let next = parent.children[key + 1] || null;
      const emptyBtn = <Btn disabled> <span style={{ width: 15, display: 'inline-block', textAlign: 'center' }}>/</span> </Btn>
      return (
        <TableTreeWrapper.Row>
          <TableTreeWrapper.Column fill>{data.name}</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="300">{data.url}</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="120"><Icon type={data.icon}/> {data.icon}</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="280">
            <BtnGroup>
              <AuthControl name="menu_update">
                <Btn onClick={() => this.editMenu(data)}>编辑</Btn>
              </AuthControl>
              <AuthControl name="menu_create">
                <Btn onClick={() => this.addMenu(data.menu_id)}>添加子页面</Btn>
              </AuthControl>
              {prev ? <AuthControl name="menu_up-order"><Btn onClick={() => this.dispatch(moveUp(data.menu_id))}>上移</Btn></AuthControl> : emptyBtn}
              {next ? <AuthControl name="menu_down-order"><Btn onClick={() => this.dispatch(moveDown(data.menu_id))}>下移</Btn></AuthControl> : emptyBtn}
              <AuthControl name="menu_delete"><Btn type="danger" onClick={() => this.dispatch(showModal('delete', data))}>删除</Btn></AuthControl>
            </BtnGroup>
          </TableTreeWrapper.Column>
        </TableTreeWrapper.Row>
      );
    }
  }

  modelFields = [
    {
      field: 'name',
      formItemProps: {
        label: '菜单名称'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '菜单名称不能为空' },
        ],
      },
    },
    {
      field: 'url',
      formItemProps: {
        label: '地址'
      }
    },
    {
      field: 'icon',
      formItemProps: {
        label: '图标'
      }
    },
    {
      field: 'menu_actions',
      hasPopupContainer: true,
      formItemProps: {
        label: '功能权限'
      },
      renderItem() {
        return (
          <Select
            mode="multiple"
            placeholder="请输入要搜索的功能权限"
            allowClear
            showSearch
            optionFilterProps="children"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
            }
          >
            {[].map(item => <Option key={item.title} value={item.action_id}>{`${item.title} ${item.name}`}</Option>)}
          </Select>
        )
      }
    }
  ]

  render() {
    const { isInit, data } = this.props;
    if (!isInit) {
      return null;
    }
    return (
      <PageLayout>
        <PageHeader title="功能菜单" />
        <PageContent>
          <TableTreeWrapper {...this.data}
            itemKey="menu_id"
            model={{ children: data }}
            treeState={this.state.treeState}
            onTreeStateChange={treeState => this.setState({ treeState })}
          />
          <FormModal
            title="添加页面"
            name="add"
            modelFields={this.modelFields}
            onCancel={() => this.dispatch(hideModal('add'))}
            onSave={(criteria, modalParams) => this.dispatch(add({ ...criteria, pid: modalParams.pid }))}
          />
          <FormModal
            title="编辑页面"
            name="edit"
            modelFields={this.modelFields}
            initState={async ({ modalParams }) => ({ model: modalParams })}
            onCancel={() => this.dispatch(hideModal('edit'))}
            onSave={(criteria, modalParams) => this.dispatch(edit(Object.assign(criteria, { menu_id: modalParams.menu_id })))}
          />
          <ConfirmModal
            title="删除"
            name="delete"
            onCancel={() => this.dispatch(hideModal('delete'))}
            onSave={({ menu_id }) => this.dispatch(actions.delete({ menu_id }))}
          />
        </PageContent>
      </PageLayout>
    )
  }
}).connect(state => {
  const { isInit, data } = state.page;
  return { isInit, data };
})
