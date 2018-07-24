import { createPageActions } from 'common/page/create-page-actions'
const baseActions = createPageActions({
  initState: {},
})

export default {
  ...baseActions,
  setState(data) {
    return (dispatch) => {
      dispatch({ type: 'SET_STATE', data } );
    }
  },
  addNode(data) {
    return (dispatch) => {
      dispatch({ type: 'ADD_TOPO_NODE', data } );
    }
  },

  editNode(data) {
    return (dispatch) => {
      dispatch({ type: 'EDIT_TOPO_NODE', data } );
    }
  },
  deleteNode(data) {
    return (dispatch) => {
      dispatch({ type: 'DELETE_TOPO_NODE', data } );
    }
  },
  addEdge(data) {
    return (dispatch) => {
      dispatch({ type: 'ADD_TOPO_EDGE', data } );
    }
  },
  deleteEdge(data) {
    return (dispatch) => {
      dispatch({ type: 'DELETE_TOPO_EDGE', data } );
    }
  },
  setSelectedNode(data) {
    return (dispatch) => {
      dispatch({ type: 'SET_SELECTED_NODE', data } );
    }
  },
  setSelectedEdge(data) {
    return (dispatch) => {
      dispatch({ type: 'SET_SELECTED_EDGE', data } );
    }
  },
  setTopoNetwork(data) {
    return (dispatch) => {
      dispatch({ type: 'SET_TOPO_NETWORK', data } );
    }
  },
  initTopo(data) {
    return (dispatch) => {
      dispatch({ type: 'INIT_TOPO', data } );
    }
  }
}
