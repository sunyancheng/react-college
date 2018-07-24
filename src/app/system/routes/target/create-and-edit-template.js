import React from 'react'
import Base from 'common/base'
import Breadcrumb from 'common/breadcrumb'
import FormModal from 'common/page/form-modal';
import api from 'common/api';
import Alert from 'common/alert';
import modelFields from './model-fields'
import './style.less'
export default function ({ edit = false }) {
  return (class extends Base {
    initState = () => api.systemTargetGetSelect().then(config => ({ config, model: {} }));

    initEditState = () => Promise.all([api.systemTargetGetSelect(), api.systemTargetDetail({ target_id: this.props.match.params.id })]).then(([config, model]) => ({ config, model }))

    onAddValidSubmit = (criteria) => {
      api.systemTargetAdd(criteria).then(() => {
        Alert.success('添加成功');
        this.props.history.push('/target')
      })
    }

    onEditValidSubmit = (criteria) => {
      api.systemTargetUpdate(criteria).then(() => {
        Alert.success('编辑成功');
        this.props.history.push('/target')
      })
    }

    render() {
      return (
        <FormModal
          isPage
          className="create-and-edit-template-page"
          title={<Breadcrumb />}
          initState={edit ? this.initEditState : this.initState}
          modelFields={modelFields(edit)}
          onCancel={() => this.props.history.push('/target')}
          onSave={edit ? this.onEditValidSubmit : this.onAddValidSubmit}
        />
      )
    }
  }).connect((state) => {
    return {
      model: state.page.model,
      config: state.page.config
    }
  })
}
