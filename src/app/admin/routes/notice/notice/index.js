import actions from 'admin/actions/notice'
import CreateNotice from 'system/routes/notice/create-notice-component'

export default CreateNotice({
  actions,
  isDelete:false,
  checkPath:(notice_id)=> `/notice/check/${notice_id}`,
  addPath: `/notice/add`,
  editPath:(notice_id) => `/notice/edit/${notice_id}`
})
