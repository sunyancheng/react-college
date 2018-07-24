import React from 'react'
import { Form, Input } from 'antd';
import { Select2 } from 'common/select'
import { RadioGroup2 } from 'common/radio-group'
import api from 'common/api';
import { TargetIconBlock } from 'common/target-icon';
import { TARGET_STATUS, TARGET_CONNECT_TYPE, TARGET_DETAIL_TYPE, TARGET_CONNECT_DETAIL, MIRROR_DETAIL, TOPO_ENABLE_TYPES } from 'common/config';

export default function (edit) {

  const setTargetMirrorDetail = ({ props, id, project_id }) => {
    if (!project_id) {
      return props.form.setFields({ 'mirrid': { value: '', errors: undefined } })
    }
    if (!id) {
      return props.form.setFields({ 'mirrid': { value: '', errors: [new Error('所在项目选择后，镜像ID不能为空')] } })
    }
    api.systemTargetGetMirrorDetail({
      id,
      project_id
    }).then(detail => {
      if (detail.os_type) {
        props.form.setFieldsValue(MIRROR_DETAIL[detail.os_type]);
        props.form.setFields({ 'mirrid': { value: props.form.getFieldValue('mirrid'), errors: undefined } })
      } else {
        props.form.setFields({ 'mirrid': { value: props.form.getFieldValue('mirrid'), errors: [new Error('请填写正确的镜像ID')] } })
      }
    })
  }

  let renderOptions = () => {
    return (
      [
        {
          field: 'project_id',
          formItemProps: {
            label: '镜像所在项目'
          },
          fieldDecorator: {
            rules: []
          },
          renderItem({ props, state: { config } }) {
            return (
              <Select2 onChange={
                (project_id) => {
                  const mirrid = props.form.getFieldValue('mirrid')
                  //避免在校验前提交，手动设置错误
                  props.form.setFields({ 'mirrid': { value: mirrid, errors: [] } })
                  setTargetMirrorDetail({ props, id: mirrid, project_id })
                }
              } allowClear showSearch options={config.projects} getValue={({ id }) => `${id}`} getLabel={({ name }) => name}
              />
            )
          }
        }, {
          field: 'mirrid',
          formItemProps: {
            label: '镜像ID',
          },
          fieldDecorator: {
            validateTrigger: 'onBlur',
            rules: [
              // { required: true, message: '镜像ID不能为空' },
            ],
          },
          renderItem({ props }) {
            const project_id = props.form.getFieldValue('project_id')
            return (
              <Input
              disabled={!project_id}
              onBlur={e => {
                props.form.setFieldsValue(MIRROR_DETAIL['init'])
                //避免在校验前提交，手动设置错误
                props.form.setFields({ 'mirrid': { value: e.target.value, errors: [] } })
                api.systemTargetGetMirrorDetail({
                  id: e.target.value,
                  project_id
                }).then(detail => {
                  if (detail.os_type) {
                    props.form.setFieldsValue(MIRROR_DETAIL[detail.os_type]);
                    props.form.setFields({ 'mirrid': { value: props.form.getFieldValue('mirrid'), errors: undefined } })
                  } else {
                    props.form.setFields({ 'mirrid': { value: props.form.getFieldValue('mirrid'), errors: [new Error('镜像ID错误')] } })
                  }
                })
              }}
              />
            )
          }
        },
        {
          field: 'os',
          formItemProps: {
            label: '操作系统',
          },
          fieldDecorator: {
            rules: [
              // { required: true, message: '操作系统不能为空' },
            ],
          },
          hasPopupContainer: true,
          renderItem({ state: { config } }) {
            return <Select2 showSearch options={config.os} getValue={({ id }) => `${id}`} getLabel={({ value }) => value} />
          }
        },
        {
          field: 'os_type',
          hasPopupContainer: true,
          formItemProps: {
            label: '系统类型',
          },
          fieldDecorator: {
            rules: [
              // { required: true, message: '系统类型不能为空' },
            ],
          },
          renderItem({ state: { config } }) {
            return <Select2 showSearch disabled options={config.os_type} getValue={({ id }) => `${id}`} getLabel={({ value }) => value} />
          }
        },
        {
          field: 'mirr_config',
          hasPopupContainer: true,
          formItemProps: {
            label: '镜像大小',
          },
          fieldDecorator: {
            rules: [
              // { required: true, message: '镜像大小不能为空' },
            ],
          },
          renderItem({ state: { config } }) {
            return <Select2 showSearch options={config.mirr_config} getValue={({ id }) => `${id}`} getLabel={({ value }) => value} />
          }
        },
        {
          render({ props, state }) {
            return [
              <Form.Item key="1" style={{ display: 'inline-block', width: '36%' }} label="访问方式" labelCol={{ span: 14 }} wrapperCol={{ span: 10 }}>
                {props.form.getFieldDecorator('connect_type', { initialValue: state.model.connect_type })(<Select2 disabled showSearch options={TARGET_CONNECT_TYPE} getValue={({ value }) => `${value}`} getLabel={({ label }) => label} onSelect={(val) => props.form.setFieldsValue({ port: val === '1' ? '3389' : '22', connect_type_detail: '' })} />)}
              </Form.Item>,
              <Form.Item key="2" style={{ display: 'inline-block', width: '30%', margin: '0 2%' }} wrapperCol={{ span: 24 }}>
                {props.form.getFieldDecorator('port', { initialValue: state.model.port })(<Input />)}
              </Form.Item>,
              <Form.Item key="3" style={{ display: 'inline-block', width: '22%' }} wrapperCol={{ span: 24 }}>
                {props.form.getFieldDecorator('connect_type_detail', { initialValue: state.model.connect_type_detail })(props.form.getFieldValue('connect_type') === '1' ? <Select2 showSearch options={TARGET_CONNECT_DETAIL} getValue={({ value }) => `${value}`} getLabel={({ label }) => label} /> : <div />)}
              </Form.Item>]
              ;
          }
        },
        {
          render({ props, state }) {
            return [
              <Form.Item key="1" label="用户信息" style={{ display: 'inline-block', width: '50%', marginRight: '2%' }} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                {props.form.getFieldDecorator('username', {
                  initialValue: state.model.username,
                  validateTrigger: 'onBlur',
                  rules: [
                    { pattern: /^\w{2,20}$/, message: '用户名长度不合法，应为2-20位' },
                    { pattern: /^\w*[a-zA-z_]\w*$/, message: '用户名格式不合法，应为大小写字母、数字、下划线的组合，不能为纯数字，纯下划线' },
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
                    }
                  ]
                })(<Input placeholder="用户名" />)}
              </Form.Item>,
              <Form.Item key="2" style={{ display: 'inline-block', width: '40%' }}>
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
        },
      ].map(item => ({ ...item, condition: isEnableTypes }))
    );
  }

  let isEnableTypes = ({ props, model }) => {
    let value = props.form.getFieldValue('detail_type') || model.detail_type
    return TOPO_ENABLE_TYPES.includes(value)
  }
  return [
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
      field: 'detail_type',
      formItemProps: {
        label: '标靶类型',
      },

      fieldDecorator: {
        rules: [
          { required: true, message: '标靶类型不能为空' },
        ],
      },
      renderItem: () => {
        return <Select2 options={TARGET_DETAIL_TYPE} />
      }
    },
    {
      condition: ({ props, model }) => model.detail_type || props.form.getFieldValue('detail_type'),
      render({ props }) {
        let { getFieldValue } = props.form;
        return (
          <Form.Item label="标靶图标" labelCol={{ span: 5 }} wrapperCol={{ col: 17 }} style={{ margin: 0 }} className="target-icon-row">
            {getFieldValue('detail_type') && <TargetIconBlock type={getFieldValue('detail_type')} title={getFieldValue('name')} />}
          </Form.Item>
        );
      }
    },
    ...renderOptions(),
    {
      field: 'target_id',
      condition: () => edit,
      renderItem(/*{ props, state }*/) {
        return <input type="hidden" />
      }
    },
    {
      render({ props, state }) {
        return <Form.Item label="标靶状态" labelCol={{ span: 5 }}>{props.form.getFieldDecorator('status', { initialValue: state.model.status || '1' })(<RadioGroup2 options={TARGET_STATUS} getValue={({ value }) => `${value}`} getLabel={({ label }) => label} />)}</Form.Item>
      }
    },

  ]
}
