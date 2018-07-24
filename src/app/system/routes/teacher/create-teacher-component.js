import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import { BtnGroup, Btn } from 'common/button-group'
import Status from 'common/page/page-table-status'
import { Select2 } from 'common/select'
import { DatePicker, Input } from 'antd';
import FormModal, { FormModalStatic } from 'common/page/form-modal';
import { TEACHER_STATUS, TEACHER_TITLE } from 'common/config';
import api from 'common/api';
import { IconButton } from 'common/button'
import Portrait from 'common/portrait'
import AvatarColumn from 'common/avatar-column'
import AccountInput from 'common/account-input'
const TextArea = Input.TextArea;
import Tree2 from 'common/tree2'

export default function ({ actions, add = false, edit = false, editCourse = false, editCampus = false, isExport = false }) {

  return (class extends Base {
    columns = [
      {
        title: '老师ID',
        dataIndex: 'teacher_id'
      }, {
        title: '老师姓名',
        dataIndex: 'name',
        render(data) {
          return <AvatarColumn src={data.pic_url} name={data.name} />
        }
      }, {
        title: '擅长技术',
        dataIndex: 'tech',
        key: 'tech'
      }, {
        title: '所属中心',
        dataIndex: 'campus_ids',
        key: 'campus_ids'
      }, {
        title: '状态',
        dataIndex: 'teacher_status',
        key: 'teacher_status',
        render: ({ teacher_status: status }) => <Status config={TEACHER_STATUS} value={status} />
      }, {
        title: '入职时间',
        dataIndex: 'entry_time',
        key: 'entry_time'
      }, {
        title: '操作',
        width: 230,
        dataIndex: 'operation',
        render: (data) => {
          return (
            <BtnGroup>
              <Btn onClick={() => { this.dispatch(actions.showModal('detail', data)) }} >查看</Btn>
              {editCourse && <Btn onClick={() => { this.dispatch(actions.showModal('course', data)) }} >课程</Btn>}
              {editCampus && <Btn onClick={() => { this.dispatch(actions.showModal('campus', data)) }} >中心</Btn>}
              {edit && <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >修改</Btn>}
            </BtnGroup>
          )
        }
      }

    ]

    filters = [
      { label: '老师ID', name: 'teacher_id', render: renderInput },
      { label: '老师姓名', name: 'name', render: renderInput },
      { label: '状态', name: 'teacher_status', options: TEACHER_STATUS, render: renderSelect },
      { label: '入职日期', name: 'entry_time', render: renderRangePicker },
    ]

    buttons = add && <IconButton size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('add', {})) }}>新建</IconButton>


    getModelFields(disableAccountInput, avatarReadonly, isEdit = false) {
      return [
        {
          render({ props, state }) {
            return props.form.getFieldDecorator('pic_url', { initialValue: state.model.pic_url })(
              <Portrait accept=".jpg,.png,.bmp,.jpeg" readonly={avatarReadonly} help style={{ position: 'absolute', top: 0, right: 20 }} />
            )
          }
        },
        {
          field: 'name',
          formItemProps: {
            label: '老师姓名',
            wrapperCol: {
              span: 8
            }
          },
          fieldDecorator: {
            rules: [
              { required: true, message: '老师姓名不能为空' },
            ],
          },
        },
        {
          hasPopupContainer: true,
          field: 'level',
          formItemProps: {
            label: '老师称号',
            wrapperCol: {
              span: 8
            }
          },
          fieldDecorator: {
            rules: [
              { required: true, message: '请选择老师称号' }
            ],
          },
          renderItem() {
            return <Select2 showSearch options={TEACHER_TITLE} getValue={({ value }) => value} getLabel={({ label }) => label} />
          }
        },
        {
          field: 'mail',
          formItemProps: {
            label: '联系邮箱',
            wrapperCol: {
              span: 8
            }
          },
          fieldDecorator: {
            rules: [
              { type: 'email', message: '联系邮箱格式不正确' }
            ],
          }
        },
        {
          field: 'tel',
          formItemProps: {
            label: '手机号',
            wrapperCol: {
              span: 8
            }
          },
          fieldDecorator: {
            rules: [
              { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }
            ],
          }

        },
        {
          field: 'entry_time',
          formItemProps: {
            label: '入职日期',
            wrapperCol: {
              span: 8
            }
          },
          fieldDecorator: {
            rules: [
              { required: true, message: '入职日期不能为空' }
            ],
            validateTrigger: 'onChange'
          },
          renderItem() {
            return <DatePicker />
          }
        },
        {
          field: 'tech',
          formItemProps: {
            label: '擅长技术',
          },
          fieldDecorator: {
            rules: [
              { required: true, message: '擅长技术不能为空' },
              { pattern: /^[\S\s]{1,30}$/, message: '擅长技术不能超过30个字符' }
            ],
          },
          renderItem() {
            return <Input placeholder="请输入技术关键词，如渗透，以;号分隔" />
          }
        },
        {
          field: 'introduction',
          formItemProps: {
            label: '个人简介',
          },
          fieldDecorator: {
            rules: [
              { required: true, message: '个人简介不能为空' },
              { pattern: /^[\S\s]{1,400}$/, message: '个人简介不能超过400个字符' }
            ],
          },
          renderItem() {
            return <TextArea rows="5" />;
          }
        },
        {
          field: 'account',
          formItemProps: {
            label: '平台账号',
          },
          render({ state, props }) {
            const isEdiable = () => {
              if (!isEdit) return false
              return !!state.model.account
            }
            return <AccountInput disabled={disableAccountInput || isEdiable()} notRequired form={props.form} defaultValue={state.model.account} />
          }
        },
      ]
    }

    getDetailFields() {
      var [avatar, ...list] = this.getModelFields(true, true);
      return [avatar, ...list.map(item => ({
        ...item,
        render: null,
        fieldDecorator: null,
        renderItem: 'static'
      }))]
    }

    editFields = [
      ...this.getModelFields(false, false, true),
      {
        field: 'teacher_status',
        formItemProps: {
          label: '老师状态'
        },
        renderItem() {
          return <Select2 showSearch options={TEACHER_STATUS} getValue={({ value }) => value} getLabel={({ label }) => label} />
        }
      },
    ]

    campusModelFields = [
      {
        field: 'campus_ids',
        formItemProps: {
          label: '关联中心',
        },
        renderItem({ state }) {
          return <Select2 mode="multiple" optionLabelProp="value" options={state.campusList} getValue={i => i.campus_id} getLabel={i => `${i.campus_id} （${i.name}）`} />
        }
      },
    ]

    courseModelFields = [
      {
        field: 'auth_ids',
        formItemProps: {
          label: '课程授权',
        },
        renderItem: ({ state }) => {
          return (
            <Tree2 options={state.courseTree} getLabel={i => i.name} getValue={i => i.id} />
          )
        }
      },
    ]

    initViewState = ({ modalParams }) => ({ model: { ...modalParams, level: modalParams.level_label } })

    initEditState = ({ modalParams }, momentize) => api.systemTeacherDetail({ teacher_id: modalParams.teacher_id }).then(model => {
      return {
        model: momentize(model, ['entry_time'])
      }
    })

    initCampus = ({ modalParams }) => api.systemCenterList().then(campusList => {
      return {
        model: {
          campus_ids: modalParams.campus_ids.split(';').filter(item => item),
        },
        campusList: campusList.list || []
      }
    })

    initCourse = async ({ modalParams }) => {
      let courseTree = await api.systemCourseAuthList({ teacher_id: modalParams.teacher_id })
      return {
        courseTree,
        model: { auth_ids: modalParams.ids }
      }
    }

    onAddValidSubmit = (criteria) => {
      this.dispatch(actions.add(criteria));
    }

    onEditValidSubmit = (criteria, modalParams) => {
      this.dispatch(actions.edit({ ...criteria, teacher_id: modalParams.teacher_id }));
    }

    onEditCourseSubmit = (criteria, modalParams) => {
      let teacher_id = modalParams.teacher_id;
      let auth_ids = criteria.auth_ids.join(',');
      this.dispatch(actions.assignCourse({ teacher_id, auth_ids }))
    }

    render() {
      return (
        <Page
          title="老师列表"
          buttons={this.buttons}
          actions={actions}
          filters={this.filters}
          columns={this.columns}
          selectId={i => i.teacher_id}
          exportUrl= {isExport ? "/home/user/admin/teacher/export" : null}
        >
          <FormModal
            name="add"
            title="创建老师"
            modelFields={this.getModelFields()}
            initState={() => ({ model: {} })}
            onCancel={() => this.dispatch(actions.hideModal('add'))}
            onSave={this.onAddValidSubmit}
          />
          <FormModalStatic
            name="detail"
            title="查看老师"
            initState={this.initViewState}
            modelFields={this.getDetailFields()}
            onCancel={() => this.dispatch(actions.hideModal('detail'))}
          />
          <FormModal
            name="edit"
            title="编辑老师"
            initState={this.initEditState}
            modelFields={this.editFields}
            onCancel={() => this.dispatch(actions.hideModal('edit'))}
            onSave={this.onEditValidSubmit}
          />
          <FormModal
            title="关联中心"
            name="campus"
            modelFields={this.campusModelFields}
            initState={this.initCampus}
            onCancel={() => this.dispatch(actions.hideModal('campus'))}
            onSave={({ campus_ids }, { teacher_id }) => this.dispatch(actions.assignCampus({ teacher_id, campus_ids: campus_ids.join(',') }))}
          />
          <FormModal
            title="课程授权"
            name="course"
            modelFields={this.courseModelFields}
            initState={this.initCourse}
            onCancel={() => this.dispatch(actions.hideModal('course'))}
            onSave={this.onEditCourseSubmit}
          />
        </Page>
      )
    }
  }).connect((state) => {
    const visible = state.page.modalVisible
    return {
      visible,
    }
  })
}
