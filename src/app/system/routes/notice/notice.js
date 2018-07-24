import actions from 'system/actions/notice'
import CreateNotice from './create-notice-component'

export default CreateNotice({
  actions,
  isDelete: true,
  checkPath: (notice_id) => `notice/view/${notice_id}`,
  addPath: `notice/add`,
  editPath: (notice_id) => `notice/edit/${notice_id}`
})
