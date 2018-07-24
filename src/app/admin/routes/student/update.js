import React from 'react'
import api from 'admin/api'
import CreateOrEdit from './create-or-edit'

export default class extends React.Component {
  render() {
    const class_student_id = this.props.match.params.studentId
    return (
      <CreateOrEdit
        title="修改报档"
        model={() => api.adminStudentDetail({ class_student_id })}
        onSave={values => api.adminStudentUpdate({ ...values, user_student_id: class_student_id })}
        disableAccountInput={true}
        disableClassOptions={true}
      />
    )
  }
}

