import actions from 'admin/actions/message'
import CreateMessage from './create-message-component'
import api from 'admin/api'

export default CreateMessage({
  actions,
  updateApi: api.adminMessagUpdate,
  detailApi: api.adminMessageDetail
})
