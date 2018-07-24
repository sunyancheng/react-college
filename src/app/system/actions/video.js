import { createPageActions } from 'common/page/create-page-actions'
import api, { cachedApi } from 'common/api'
import createCRUDActions from 'common/page/create-crud-actions'
import { UPDATE_VIDEO_MODAL } from 'common/action-types'
import Alert from 'common/alert'
const baseActions = createPageActions({
  initState: {},
  getListApi: api.systemVideoList
})
const updateVideoModal = (params) => ({ type: UPDATE_VIDEO_MODAL, params })

export default {
  ...baseActions,
  ...createCRUDActions('systemVideo', baseActions, "getList"),
  // getPage: baseActions.getList,
  isVideoExist: ({ json_fnames }) => {
    return api.systemVideoExist({ json_fnames })
      .then(({ is_exist, names }) => ({ valid: !is_exist, names }))
  },
  getVideos: (video_id) => {
    return api.systemVideoDirectoryGetVideos({ video_id }) // return [{...},{...}]
  },
  addDirectory: (dir) => {
    return dispatch => {
      api.systemVideoAddDirectory({ dir })
        .then(() => {
          dispatch(baseActions.getList())
          Alert.success("添加成功")
          dispatch(baseActions.hideModal('add_dir'))
        })
    }
  },
  editDirectory: ({ files_json, pid }) => {
    return dispatch => {
      api.systemVideoAdd({ pid, files_json })
        .then(() => {
          Alert.success("修改成功")
          cachedApi['systemVideoAdd'].clear()
          dispatch(baseActions.getList())

        })
    }
  },
  editVideo: ({ name, fname, duration, video_id }) => {
    return dispatch => {
      api.systemVideoUpdate({ name, fname, duration, video_id })
        .then(() => {
          Alert.success("修改成功")
          cachedApi['systemVideoUpdate'].clear()
          dispatch(baseActions.getList())
        })
    }
  },
  addVideo: ({ pid, files_json }) => {
    return dispatch => {
      api.systemVideoAdd({ pid, files_json }).then(() => {
        Alert.success('添加成功');
        cachedApi['systemVideoUpdate'].clear()
        dispatch(baseActions.getList())
      })
    }
  },
  checkVideo: ({ status, video_id, comment }) => {
    return dispatch => {
      api.systemVideoCheck({ status, video_id, comment })
        .then(() => {
          Alert.success('操作成功');
          cachedApi['systemVideoCheck'].clear()
          dispatch(baseActions.hideModal('check'))
          dispatch(baseActions.getList())
        })
    }
  },
  updateVideoModal
}
