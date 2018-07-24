import React from 'react';
import TableTreeNode from './table-tree-node';
import TableTreeChildren from './table-tree-children';
import TableTreeRowCircle from './table-tree-row-circle';
import PropTypes from 'prop-types'
import RowCross from './row-cross';
import TreeEmpty from './tree-empty';
import './table-tree.less';
class TableTree extends React.Component {
  static propTypes = {
    itemKey: PropTypes.string,
    childrenName: PropTypes.string,
    model: PropTypes.object,
    treeState: PropTypes.object.isRequired,
    rootBuilder: PropTypes.func.isRequired,
    nodeBuilder: PropTypes.func.isRequired,
    onTreeStateChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    treeState: {},
    itemKey: 'id',
    model: { children: [] },
    childrenName: 'children'
  }

  handleFold = (item) => {
    var id = item[this.props.itemKey];
    var treeState = JSON.parse(JSON.stringify(this.props.treeState));
    treeState[id] = !treeState[id];
    this.props.onTreeStateChange(treeState, item);
  }

  buildChildren({ list = [], lvl, parent, Row }) {

    var Node = TableTreeNode;
    var Children = TableTreeChildren;
    var itemKey = this.props.itemKey;
    var treeState = this.props.treeState;
    const childrenName = this.props.childrenName;
    return (
      <Children>
        {list.map((item, i) => (
          <Node key={i}>
            <Row
              foldable={item.children && item.children.length}
              isFolded={!treeState[item[itemKey]]}
              onFold={() => this.handleFold(item)}
            >
              {this.props.nodeBuilder(item, parent, i, lvl)}
            </Row>
            {!treeState[item[itemKey]] ? null : this.buildChildren({ Row, list: item[childrenName], parent: item, lvl: lvl + 1 })}
          </Node>
        ))}
      </Children>);
  }

  render() {
    var Node = TableTreeNode;
    var Row = TableTreeRowCircle;

    var classWrapper = 'tree-table--circle';
    if (this.props.rowType === 'cross') {
      Row = RowCross;
      classWrapper = 'tree-table--cross';
    }

    var list = this.props.model.children || [];
    if(!list.length) {
      return <TreeEmpty />
    }
    return (
      <div className={'tree-table ' + (classWrapper || '')}>
        <Node>
          <Row root className="tree-table__header">{this.props.rootBuilder(this.props.model)}</Row>
          {this.buildChildren({ list, lvl: 1, parent: this.props.model, Row })}
        </Node>
      </div>
    );
  }
};
TableTree.Children = TableTreeChildren;
TableTree.Node = TableTreeNode;
TableTree.RowCircle = TableTreeRowCircle;
export { TableTree };
export default TableTree;
