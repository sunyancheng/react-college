import React from 'react'
import Base from 'common/base'
import FormModal from './form'

const FormModalCommon = (class extends Base {
  isVisible = (props = this.props) => props.isPage || props.modalVisible[props.name]

  render() {
    if (!this.isVisible()) return null
    return <FormModal {...this.props} />
  }
}).connect(state => {
  const { modalVisible } = state.page;
  return { modalVisible }
})

export default FormModalCommon

export const FormModalStatic = (props) => {
  return <FormModalCommon className="form-static-modal" {...props} />
}

export const FormModalCombine = (props) => {
  return <FormModalCommon className="form-combine-modal" {...props} />
}
