import { renderInput, renderSelect, renderRangePicker } from 'common/page/page-filter/filter'
import actions from 'admin/actions/answer'
import api from 'admin/api'
import CreateAnswerPage from 'system/routes/answer/create-answer-page'
import { ANSWER_STATUS } from 'common/config'
import store from 'admin/store'
var { campus_id } = store.getState().app
const columns = [
  {
    title: '班级ID',
    dataIndex: 'class_id',
  }
]

const filters = [
  { label: '班级ID', name: 'class_id', render: renderInput },
  { label: '提问课程', name: 'course', render: renderInput },
  { label: '提问学员', name: 'student', render: renderInput },
  { label: '问题', name: 'question', render: renderInput },
  { label: '答疑状态', name: 'status', options: ANSWER_STATUS, render: renderSelect },
  { label: '答疑老师', name: 'teacher', render: renderInput },
  { label: '提问日期', name: 'range', render: renderRangePicker },
]

export default CreateAnswerPage({ getAnswerDetail: api.systemDeanAnswerDetail, exportUrl:`/core/course/dean/qa/export?campus_id=${campus_id}`, actions, columns, filters })
