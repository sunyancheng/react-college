import React from 'react';
import { Select } from 'antd';

export class Select2 extends React.Component {

  static defaultProps = {
    getOptionModel: () => { },
    getValue: i => i.value,
    getLabel: i => i.label,
    placeholder: '请选择'
  }

  render() {
    const { getValue, getLabel, optionFilterProp = "children", ...props } = this.props;
    return (
      <Select showSearch {...{ optionFilterProp, ...props }}>
        {props.options.map((item) =>
          <Select.Option key={getValue(item)} value={getValue(item)} option={props.getOptionModel(item)}>{getLabel(item)}</Select.Option>
        )}
      </Select>
    );
  }
}
