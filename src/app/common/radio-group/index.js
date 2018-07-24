import React from 'react';
import { Radio } from 'antd';

export class RadioGroup2 extends React.Component {
  render() {
    const { getValue = i => i.value, getLabel = i => i.label, ...props } = this.props;
    return (
      <Radio.Group {...props}>
        {props.options.map((item) =>
          <Radio key={getValue(item)} value={getValue(item)}>{getLabel(item)}</Radio>
        )}
      </Radio.Group>
    );
  }
}
