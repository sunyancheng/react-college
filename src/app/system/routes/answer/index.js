import { renderInput, renderSelect, renderRangePicker } from 'common/page/page-filter/filter'
import actions from 'system/actions/answer'
import api from 'common/api'
import CreateAnswerPage from './create-answer-page'
import { ANSWER_STATUS } from 'common/config'
const columns = [
  {
    title: '中心名称',
    dataIndex: 'campus',
    // width: 150
  }
]

const filters = [
  { label: '中心名称', name: 'campus', render: renderInput },
  { label: '提问课程', name: 'course', render: renderInput },
  { label: '问题', name: 'question', render: renderInput },
  { label: '答疑状态', name: 'status', options: ANSWER_STATUS, render: renderSelect },
  { label: '答疑老师', name: 'teacher', render: renderInput },
  { label: '提问日期', name: 'range', render: renderRangePicker },
]

export default CreateAnswerPage({ isDeleteAble: true, getAnswerDetail: api.systemAnswerDetail, exportUrl:"/core/course/admin/qa/export", actions, columns, filters })
