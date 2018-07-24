import React from 'react';
import './style.less';
import normalizeMouseWheel from './normalize-mousewheel';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
var containerWidth = 0;

export default class extends React.Component {
  static propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    getContainer: PropTypes.func,
    selectId: PropTypes.func.isRequired
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mouseup', this.handleWindowMouseUp);
    window.removeEventListener('mousemove', this.handleWindowMouseMove);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mouseup', this.handleWindowMouseUp);
    window.addEventListener('mousemove', this.handleWindowMouseMove);
    this.reflow();
  }

  componentDidUpdate() {
    this.reflow();
  }

  reflow() {
    setTimeout(() => {
      this.alignTable();
      this.scrollByOffset(0, 0);
    });
  }

  getTableWidthHeight() {
    const { contentMiddleBody, contentLeftBody, contentRightBody } = this.refs;
    if (!contentMiddleBody) return;

    const columnWs = [], rowHs = [];

    // 获取列宽
    const columns = contentMiddleBody.children[0];
    if (columns && columns.children) {
      for (var i = 0; i < columns.children.length; i++) {
        columnWs.push(columns.children[i].offsetWidth);
      }
    }

    const list = [contentMiddleBody, contentLeftBody, contentRightBody].filter(i => i);

    // 获取最大的行高

    list.forEach(({ children }) => {
      for (var i = 0; i < children.length; i++) {
        rowHs[i] = Math.max(rowHs[i] || 0, children[i].offsetHeight);
      }
    });
    return { columnWs, rowHs };
  }

  handleResize = debounce(() => {
    this.forceUpdate();
  }, 50)

  // 对齐表格的，主要是表头固定，左右两列也是固定，都是手动通过代码进行固定
  alignTable = () => {
    const { headerColgroup, contentMiddleBody, contentLeftBody, contentRightBody } = this.refs;
    if (!contentMiddleBody) return;
    const list = [contentMiddleBody, contentLeftBody, contentRightBody].filter(i => i);

    // 现获取行高和列宽，再进行设置，减少渲染提高性能
    const { columnWs, rowHs } = this.getTableWidthHeight();

    columnWs.forEach((w, i) => headerColgroup.children[i].style.width = w + 'px');
    function setHeight(parent) {
      if (parent) {
        for (var i = 0; i < rowHs.length; i++) {
          parent.children[i].style.height = rowHs[i] + 'px';
        }
      }
    }
    list.forEach(setHeight);
  }

  // 获取父亲容器的宽度，用于动态计算是否需要让左右的column 固定显示，
  // 因为如果宽度足够，就不需要左右滚动
  getContainerWidth = () => {
    var tableContainer = this.props.getContainer ? this.props.getContainer() : document.querySelector('.page-layout__content__rest');
    if (tableContainer) {
      this.containerWidth = tableContainer.offsetWidth;
      containerWidth = this.containerWidth;
    } else {
      this.containerWidth = containerWidth;
    }
    return this.containerWidth || 0;
  }

  handleScroll = (e) => {
    var { pixelY, pixelX } = normalizeMouseWheel(e);
    pixelY = Math.round(pixelY * .5);
    pixelX = Math.round(pixelX * .5);
    this.scrollByOffset(pixelX, pixelY);
  }

  handleClickRow = (item, i) => {
    this.props.onClickRow && this.props.onClickRow(item, i)
  }

  setLocation(clientX, clientY) {
    this.x = clientX;
    this.y = clientY;
  }

  handleWindowMouseUp = () => {
    this.mouseIsDownRight = false;
    this.mouseIsDownBottom = false;
  }

  handleWindowMouseMove = ({ clientX, clientY }) => {
    if (this.mouseIsDownBottom) {
      this.throttleMouseMove(clientX, 0);
    } else if (this.mouseIsDownRight) {
      this.throttleMouseMove(0, clientY);
    }
  }

  hScrollPanelMouseDown = (e) => {
    e.preventDefault();
    let x = e.clientX - this.refs.hScrollBar.getBoundingClientRect().left;
    this.scrollByOffset(x, 0);
  }

  vScrollPanelMouseDown = (e) => {
    e.preventDefault();
    let y = e.clientY - this.refs.vScrollBar.getBoundingClientRect().top;
    this.scrollByOffset(0, y);
  }

  hScrollBarMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.mouseIsDownBottom = true;
    this.setLocation(e);
  }

  vScrollBarMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.mouseIsDownRight = true;
    this.setLocation(e);
  }

  // throttleMouseMove = throttle((...args) => this.handleMouseMove(...args), 50)
  throttleMouseMove = (...args) => this.handleMouseMove(...args)

  handleMouseMove = (clientX, clientY) => {
    const offsetX = clientX - this.x;
    var offsetY = clientY - this.y;
    this.setLocation(clientX, clientY);
    this.scrollByOffset(offsetX, offsetY);
  }

  scrollByOffset(offsetX, offsetY) {
    var { headerContent, contentMiddle, contentLeft, contentRight,
      hScrollBar, hScrollPanel,
      vScrollBar, vScrollPanel } = this.refs;
    if (!contentMiddle) return;
    const headerHeight = headerContent.offsetHeight;
    const bodyWidth = contentMiddle.parentElement.offsetWidth;
    const bodyHeight = contentMiddle.parentElement.offsetHeight;
    const contentWidth = contentMiddle.offsetWidth;
    const contentHeight = contentMiddle.offsetHeight;

    var hOffsetRatio = 1, vOffsetRatio = 1;

    if (contentHeight <= bodyHeight) {
      vScrollPanel.style.display = 'none';
      vScrollBar = null;
      vScrollPanel = null;
    }
    if (contentWidth <= bodyWidth) {
      hScrollBar = null;
      hScrollPanel = null;
    }

    if (hScrollBar) {
      var hScrollPanelWidth = hScrollPanel.offsetWidth;
      var hScrollBarWidth = hScrollPanelWidth * bodyWidth / contentWidth;
      hOffsetRatio = (contentWidth - bodyWidth) / (hScrollPanelWidth - hScrollBarWidth);
    }

    if (vScrollBar) {
      var vScrollPanelHeight = bodyHeight + headerHeight;
      var vScrollBarHeight = vScrollPanelHeight * bodyHeight / contentHeight;
      vOffsetRatio = (contentHeight - bodyHeight) / (vScrollPanelHeight - vScrollBarHeight);
    }

    offsetX = offsetX * hOffsetRatio;
    offsetY = offsetY * vOffsetRatio;

    const contentRect = contentMiddle.getBoundingClientRect();
    const bodyRect = contentMiddle.parentElement.getBoundingClientRect();
    var left = Math.round(contentRect.left - bodyRect.left - offsetX);
    var top = Math.round(contentRect.top - bodyRect.top - offsetY);
    if (left < -contentWidth + bodyWidth) left = -contentWidth + bodyWidth;
    if (left > 0) left = 0;
    if (top < -contentHeight + bodyHeight) top = -contentHeight + bodyHeight;
    if (top > 0) top = 0;
    headerContent.style.transform = `translateX(${left}px)`;
    contentMiddle.style.transform = `translate(${left}px,${top}px)`;
    contentLeft && (contentLeft.style.transform = `translateY(${top}px)`);
    contentRight && (contentRight.style.transform = `translateY(${top}px)`);
    // 宽度是一个百分比
    if (hScrollBar) {
      hScrollBar.style.width = `${Math.round(hScrollBarWidth)}px`;
      hScrollBar.style.transform = `translateX(${Math.round(-left / hOffsetRatio)}px)`;
    }

    if (vScrollBar) {
      vScrollPanel.style.display = 'block';
      vScrollPanel.style.height = `${vScrollPanelHeight}px`;
      vScrollBar.style.height = `${Math.round(vScrollBarHeight)}px`;
      vScrollBar.style.transform = `translateY(${Math.round(-top / vOffsetRatio)}px)`;
    }
  }

  calcColumnsWidth(columns) {
    var regx = /\d+px$/;
    return columns.reduce((sum, item) => {
      var width = 0;
      if (typeof (item.width) === 'number') {
        width = item.width;
      } else if (typeof (item.width) === 'string' && regx.test(item.width)) {
        width = parseInt(item.width);
      }

      return sum + width;
    }, 0);
  }

  handleRowEnter = (i) => {
    const { contentMiddleBody, contentLeftBody, contentRightBody } = this.refs;
    !this.props.onClickRow
      ? [contentMiddleBody, contentLeftBody, contentRightBody].filter(i => i).forEach(ele => ele.children[i].className += ' big-table-cell--hover')
      : [contentMiddleBody, contentLeftBody, contentRightBody].filter(i => i).forEach(ele => ele.children[i].className += ' big-table-cell--hover big-table-cell--hover-pointer')
  }

  handleRowLeave = i => {
    const { contentMiddleBody, contentLeftBody, contentRightBody } = this.refs;
    !this.props.onClickRow
      ? [contentMiddleBody, contentLeftBody, contentRightBody].filter(i => i).forEach(ele => ele.children[i].className = ele.children[i].className.replace(' big-table-cell--hover', ''))
      : [contentMiddleBody, contentLeftBody, contentRightBody].filter(i => i).forEach(ele => ele.children[i].className = ele.children[i].className.replace(' big-table-cell--hover big-table-cell--hover-pointer', ''))
  }

  renderHeaderSideOf({ side, columns }) {
    if (columns.length === 0) return null;
    const width = this.calcColumnsWidth(columns);
    return (
      <div className={'big-table__header__' + side.toLowerCase()} style={{ width }}>
        {columns.map((column, i) =>
          <div key={i} className="big-table-cell" style={column.headerStyle}>
            {column.title}
          </div>
        )}
      </div>
    );
  }

  renderContentSideOf({ side, columns, data }) {
    if (columns.length === 0) return null;
    const sideL = side.toLowerCase();
    const columnsWidth = this.calcColumnsWidth(columns);
    var style;
    if (sideL !== 'middle') {
      style = { flexBasis: columnsWidth };
    }
    return (
      <div className={`big-table__content__${sideL}`} style={style}>
        <table ref={`content${side}`}>
          <colgroup>
            {columns.map((r, i) =>
              <col key={i} style={{ width: r.width, minWidth: r.width }} />
            )}
          </colgroup>
          <tbody ref={`content${side}Body`}>
            {data.map((item, i) =>
              <tr key={this.props.selectId(item, i)}
                className="big-table-row"
                onMouseEnter={() => this.handleRowEnter(i)}
                onMouseLeave={() => this.handleRowLeave(i)}
                onClick={() => this.handleClickRow(item, i)}
              >
                {columns.map((column, j) =>
                  <td key={j}
                    style={column.cellStyle}
                    className={`big-table-cell ${column.cellClassName || ''}`}
                  >{this.renderCell(item, column)}</td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  renderCell(data, column) {
    var value = data[column.dataIndex];
    return (column.render ? column.render(data, value, column) : value);
  }

  canTableFitInContainer(columns = this.props.columns) {
    const containerWidth = this.getContainerWidth();
    const totalWidth = this.calcColumnsWidth(columns);
    const canFitIn = totalWidth <= containerWidth;
    return canFitIn;
  }

  render() {
    const { data, columns } = this.props;
    if (!data || !columns) {
      return null;
    }

    const canFitIn = this.canTableFitInContainer(columns);
    var leftColumns = [];
    var rightColumns = [];
    var contentColumns = columns;
    if (!canFitIn) {
      leftColumns = columns.filter(i => i.fixed === 'left');
      rightColumns = columns.filter(i => i.fixed === 'right');
      contentColumns = columns.filter(i => !i.fixed);
    }
    return (
      <div className="big-table"
        onWheel={this.handleScroll}
      >
        <div className="big-table__header">
          {this.renderHeaderSideOf({ side: 'Left', columns: leftColumns })}
          <div className="big-table__header__content">
            <table className="big-table__header__content__wrapper" ref="headerContent">
              <colgroup ref="headerColgroup">
                {contentColumns.map((r, i) =>
                  <col key={i} style={{ width: r.width, minWidth: r.width }} />
                )}
              </colgroup>
              <thead>
                <tr>
                  {contentColumns.map((column, i) =>
                    <td key={column.dataIndex || i} className="big-table-cell" style={column.headerStyle}>
                      {column.renderTitle ? column.renderTitle(column) : column.title}
                    </td>
                  )}
                </tr>
              </thead>
            </table>
          </div>
          {this.renderHeaderSideOf({ side: 'Right', columns: rightColumns })}
        </div>
        <div className="big-table__content">
          {this.renderContentSideOf({ side: 'Left', columns: leftColumns, data })}
          {this.renderContentSideOf({ side: 'Middle', columns: contentColumns, data })}
          {this.renderContentSideOf({ side: 'Right', columns: rightColumns, data })}
        </div>
        <div className="vertical-scroll-panel"
          ref="vScrollPanel"
          onMouseDown={this.vScrollPanelMouseDown}
        >
          <div ref="vScrollBar" onMouseDown={this.vScrollBarMouseDown} className="vertical-scroll-panel__bar" />
        </div>
        {!canFitIn &&
          <div className="horizontal-scroll-panel"
            ref="hScrollPanel"
            onMouseDown={this.hScrollPanelMouseDown}
          >
            <div ref="hScrollBar" onMouseDown={this.hScrollBarMouseDown} className="horizontal-scroll-panel__bar" />
          </div>
        }
        {this.props.children}
      </div >
    )
  }
}
