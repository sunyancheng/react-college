import React from 'react'
import Base from 'common/base'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment'
import FormWrapper from './form-wrapper'
import { Row, Col } from 'antd'
import './style.less'

const momentize = (modalParams, fields, dateFormat = 'YYYY-MM-DD') => {
  const newModal = { ...modalParams }
  fields.map(field => {
    newModal[field] = newModal[field] && moment(newModal[field], dateFormat)
  })
  return newModal
}

export const momentToString = (modalParams, dateFormat = 'YYYY-MM-DD') => {
  const newModal = { ...modalParams }
  for (const key in newModal) {
    if (moment.isMoment(newModal[key])) {
      newModal[key] = newModal[key].format(dateFormat)
    }
  }
  return newModal
}
class StaticText extends React.Component {
  render() {

    var value = this.props.value
    if (Array.isArray(value)) {
      value = value.join()
    }
    return <span className={this.props.className}>{this.props.value}</span>
  }
}

export default (class extends Base {
  static propTypes = {
    title: PropTypes.any.isRequired,
    name: PropTypes.string,
    modelFields: PropTypes.array.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func
  }

  static defaultProps = {
    okText: '确认'
  }

  state = {}

  componentDidMount() {
    this.doInit()
  }

  // 调用组件参数的初始化函数，通常是获取一些 select 的 options 数据
  doInit(props = this.props) {
    const initState = { init: true }
    if (props.initState) {
      Promise.resolve(props.initState(props, momentize)).
        then(state => this.setState(Object.assign(initState, state)))

      return;
    }
    this.setState(initState);
  }

  handleOk = (callback) => () => {
    const errors = this.props.form.getFieldsError()
    for (let key in errors) {
      if (errors[key] !== undefined) return
    }
    this.props.form.validateFields((err, values) => {
      if (err) return;
      callback(momentToString(values, this.props.dateFormat), this.props.modalParams, this.state, this.setState.bind(this));
    });
  }

  renderItem = (item) => {
    if (item.renderItem === 'static') {
      return <StaticText />
    }
    var element = item.renderItem({ item, state: this.state, setState: this.setState.bind(this), props: this.props });
    //只对某些组件添加popupContainer属性 如select
    let params = item.hasPopupContainer ? { getPopupContainer: () => this.refs.container } : {};
    return React.cloneElement(element, params);
  }

  fieldCondition = (field) => {
    if (!field.condition) return true;
    return field.condition({ model: this.state.model, state: this.state, props: this.props, field })
  }

  render() {
    // 没有初始化好就返回
    if (!this.state.init) return null;

    const { isPage, children, form, modelFields, className, onCancel, buttons, title, okText, cancelText, extraText, extraBtn } = this.props;
    const { getFieldDecorator } = form;
    const defaultFormItemProps = isPage ?
      {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 }
      } : {
        labelCol: { span: 4 },
        wrapperCol: { span: 19 }
      }

    let responsive = isPage ? { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 } : { span: 24 }

    //表带的上下文，用于编辑的时候指定初始值
    const model = this.state.model;
    return (
      <FormWrapper
        isPage={isPage}
        title={title}
        onOk={this.props.onSave && this.handleOk(this.props.onSave)}
        onCancel={onCancel}
        extraBtn={extraBtn && this.handleOk(extraBtn)}
        className={className}
        buttons={buttons}
        okText={okText}
        cancelText={cancelText}
        extraText={extraText}
      >
        <div ref="container" className="form-modal">
          <Form>
            <Row gutter={16}>
              {modelFields.filter(this.fieldCondition).map((item, i) => {
                if (!!item.responsive) responsive = item.responsive
                if (item.render) {
                  return (
                    <Col {...responsive} key={i}>{item.render({
                      setState: this.setState.bind(this),
                      item,
                      state: this.state,
                      props: this.props,
                      dispatch: this.props.dispatch
                    })}
                    </Col>)
                }
                const defaultFieldDecorator = model ? {
                  initialValue: model[item.field],
                  validateTrigger: 'onBlur'
                } : { validateTrigger: 'onBlur' };
                return (
                  <Col {...responsive} key={i}>
                    <Form.Item {...Object.assign({}, defaultFormItemProps, item.formItemProps)}>
                      {getFieldDecorator(item.field, Object.assign({}, defaultFieldDecorator, item.fieldDecorator))(
                        item.renderItem ? this.renderItem(item) : <Input />
                      )}
                    </Form.Item>
                  </Col>
                )
              })}
            </Row>
          </Form>
        </div>
        {children}
      </FormWrapper>
    );
  }
}).formConnect(state => {
  const { modalParams } = state.page;
  return { modalParams }
})
