import Alert from 'common/alert';
import {
  api as _api,
  cachedApi as _cachedApi
} from 'common/api';

export default function (name, baseActions, refreshAction = 'getPage', api = _api, cachedApi = _cachedApi) {
  return {
    add(data) {
      return dispatch => {
        const method = `${name}Add`
        api[method](data).then(() => {
          Alert.success('添加成功');
          cachedApi[method].clear()
          dispatch(baseActions.hideModal('add'));
          if (!data.disableReset) {
            dispatch(baseActions.resetCriteria());
          }
          dispatch(baseActions[refreshAction]({ page: '1' }));
        })
      }
    },
    create(data) {
      return dispatch => {
        const method = `${name}Create`
        api[method](data).then(() => {
          Alert.success('添加成功');
          cachedApi[method].clear()
          dispatch(baseActions.hideModal('create'));
          if (!data.disableReset) {
            dispatch(baseActions.resetCriteria());
          }
          dispatch(baseActions[refreshAction]({ page: '1' }));
        })
      }
    },
    edit(data) {
      return dispatch => {
        const method = `${name}Update`
        api[method](data).then(() => {
          Alert.success("修改成功");
          cachedApi[method].clear()
          dispatch(baseActions.hideModal('edit'));
          dispatch(baseActions[refreshAction]());
        })
      }
    },
    detail(id) {
      return dispatch => {
        api[`${name}Detail`](id).then((detail) => {
          dispatch(baseActions.setPageState({
            detail
          }));
        });
      }
    },
    delete(data) {
      return dispatch => {
        const method = `${name}Delete`
        const close = () => dispatch(baseActions.hideModal('delete'));
        api[method](data).then(() => {
          Alert.success("删除成功");
          cachedApi[method].clear()
          dispatch(baseActions[refreshAction]());
          close();
        }).catch(close)
      }
    }
  };
}
