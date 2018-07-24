import React from 'react'
import api from 'admin/api'
import CreateOrEdit from './create-or-edit'

export default class extends React.Component {
  render() {
    return (
      <CreateOrEdit
        model={() => ({ gender: '1' })}
        onSave={api.adminStudentAdd}
        disableAccountInput={false}
        disableClassOptions={false}
      />
    )
  }
}

