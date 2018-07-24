import {
  INIT_PAGE,
  CLEAR_PAGE,
  LOADING,
  GET_PAGE,
  GET_LIST,
  SHOW_MODAL,
  HIDE_MODAL,
  SET_CRITERIA,
  RESET_CRITERIA,
  SET_PAGE_STATE,
  MODAL_LOADING,
  // video
  UPDATE_VIDEO_MODAL
} from 'common/action-types'


const getDefaultState = () => ({
  page: 1,
  pagesize: 10,
  modalVisible: {},
  criteria: {},
  checkedRows: [],
})

export default function (state = getDefaultState(), action) {
  switch (action.type) {
    case INIT_PAGE:
      return { ...state, ...action.initState }
    case CLEAR_PAGE:
      return getDefaultState()
    case LOADING:
      return { ...state, loading: action.loading }
    case MODAL_LOADING:
      return { ...state, modalLoading: action.loading }
    case SET_PAGE_STATE:
      return { ...state, ...action.state }
    case SET_CRITERIA:
      return { ...state, criteria: { ...state.criteria, ...action.state } }
    case RESET_CRITERIA:
      return { ...state, criteria: { ...action.state } }
    case GET_LIST:
      return {
        ...state,
        data: action.data,
        list: action.data.list || [],
        loading: false
      }
    case GET_PAGE:
      return {
        ...state,
        data: action.data,
        list: action.data.list || [],
        pagesize: parseInt(action.data.pagesize),
        page: parseInt(action.data.page),
        total: parseInt(action.data.total),
        loading: false
      };
    case SHOW_MODAL:
      return Object.assign({}, state, { modalVisible: Object.assign({}, state.modalVisible, { [action.name]: true }), modalParams: action.modalParams });
    case HIDE_MODAL:
      return Object.assign({}, state, { modalVisible: Object.assign({}, state.modalVisible, { [action.name]: false }), modalParams: null });
    case UPDATE_VIDEO_MODAL:
      return { ...state, modalParams: { ...state.modalParams, ...action.params } }
      default:
      return state
  }
}
