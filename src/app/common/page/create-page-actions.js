import {
  INIT_PAGE,
  CLEAR_PAGE,
  LOADING,
  GET_LIST,
  GET_PAGE,
  SHOW_MODAL,
  HIDE_MODAL,
  RESET_CRITERIA,
  SET_PAGE_STATE,
  // SET_NONE_CRITERIA,
  SET_CRITERIA,
  MODAL_LOADING
} from 'common/action-types'
import moment from 'moment';

export const momentToString = (criteria, formatter) => {
  return (
    Object.keys(criteria)
      .filter(key => moment.isMoment(criteria[key]))
      .reduce((obj, key) => ({ ...obj, [key]: criteria[key].format(formatter) }), {})
  )
}
export const createPageActions = ({
  initState, getListApi  // initState为当前页面初始状态注入的独特的字段
}) => {
  var uid
  const actions = {
    initPage(state) {
      uid = Date.now()
      return {
        type: INIT_PAGE, initState: { ...initState, ...state, isInit: true, uid }
      }
    },
    clearPage() {
      return {
        type: CLEAR_PAGE, uid
      }
    },
    loading(loading) {
      return {
        type: LOADING,
        loading,
        uid
      }
    },
    modalLoading(loading) {
      return {
        type: MODAL_LOADING,
        loading,
        uid
      }
    },
    setPageState(state) {
      return {
        type: SET_PAGE_STATE,
        state,
        uid
      }
    },
    setCriteria(state) {
      return {
        type: SET_CRITERIA,
        state,
        uid
      }
    },
    resetCriteria() {
      return {
        type: RESET_CRITERIA,
        state: {},
        uid
      }
    },
    getList(state) {
      return (dispatch, getState) => {
        dispatch(actions.loading(true))
        const pageState = getState().page
        const string = momentToString(pageState.criteria, 'YYYY-MM-DD')
        return getListApi({ ...pageState.criteria, ...string, ...state }).then(data => {
          dispatch({ type: GET_LIST, data, uid })
        }).catch(() => dispatch(actions.loading(false)))
      }
    },
    // 获取分页
    getPage(criteria = {}) {
      return (dispatch, getState) => {
        var pageState = getState().page;
        var string = momentToString(pageState.criteria, 'YYYY-MM-DD');
        if (pageState.loading) return;
        dispatch(actions.loading(true));
        criteria = Object.assign({ page: pageState.page, pagesize: pageState.pagesize }, pageState.criteria, criteria, string, {});
        (function doGetPage(_criteria) {
          getListApi(_criteria).then(data => {
            if (data.list.length === 0 && data.page != 1) {
              doGetPage({ ..._criteria, page: 1 })
              return;
            }
            dispatch({ data, type: GET_PAGE, uid });
            if (getState().page.checkedAll) {
              dispatch(actions.setPageState({ checkedRows: data.list }))
            }
          }).catch(() => dispatch(actions.loading(false)));
        })(criteria)
      }
    },

    changePagination(current, pageSize, rest) {
      return dispatch => {
        dispatch(actions.setPageState({ page: current, pagesize: pageSize, checkedRows: [], checkedAll: false }));
        dispatch(actions.getPage(rest));
      }
    },

    checkRow(rowData) {
      return (dispatch, getState) => {
        const checkedRows = getState().page.checkedRows || [];
        const isChecked = !checkedRows.includes(rowData);
        if (isChecked) {
          return dispatch(actions.setPageState({ checkedRows: checkedRows.concat(rowData) }));
        }
        var rows = checkedRows.slice();
        rows.splice(rows.indexOf(rowData), 1);
        dispatch(actions.setPageState({ checkedRows: rows }))
      }
    },
    setCheckAll: (dl) => {
      return (dispatch, getState) => {
        const checkedRows = getState().page.checkedRows
        if (checkedRows.length === dl) {
          dispatch(actions.setPageState({ checkedAll: true }))
        } else {
          dispatch(actions.setPageState({ checkedAll: false }))
        }
      }
    },
    showModal(name, modalParams) {
      return {
        type: SHOW_MODAL, name, modalParams, uid
      }
    },

    hideModal(name) {
      return {
        type: HIDE_MODAL, name, uid
      }
    }
  }
  return actions
}
