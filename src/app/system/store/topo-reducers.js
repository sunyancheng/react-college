import { DEFAULT_TARGET_NODES, DEFAULT_TARGET_EDGES } from 'common/config'
export default function(state = {}, action) {
  let { targetNodes = DEFAULT_TARGET_NODES, targetEdges = DEFAULT_TARGET_EDGES } = state;
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.data}
    case 'ADD_TOPO_NODE':
      return { ...state, targetNodes: targetNodes.concat(action.data)}
    case 'EDIT_TOPO_NODE':
      let index = targetNodes.findIndex(item => item.id === action.data.id)
      targetNodes.splice(index, 1, action.data)
      return { ...state, targetNodes }
    case 'DELETE_TOPO_NODE':
      return { ...state, targetEdges: targetEdges.filter(item => item.from !== action.data && item.to !== action.data ), targetNodes: targetNodes.filter(item => item.id !== action.data) }
    case 'SET_SELECTED_NODE':
      return { ...state, selectedNode: action.data }
    case 'ADD_TOPO_EDGE':
      return { ...state, targetEdges: targetEdges.concat(action.data)}
    case 'DELETE_TOPO_EDGE':
      return { ...state, targetEdges: targetEdges.filter(item => item.id !== action.data) }
    case 'SET_SELECTED_EDGE':
      return { ...state, selectedEdge: action.data }
    case 'SET_TOPO_NETWORK':
      return { ...state, network: action.data}
    case 'INIT_TOPO':
      return { ...state, targetEdges: action.data.targetEdges, targetNodes: action.data.targetNodes, selectedNode: action.data.selectedNode }
    default:
      return state
  }
}
