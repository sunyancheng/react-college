import React from 'react'
import { Input } from 'antd'
import Icon from 'common/icon'

const LABELS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G'
]

export default (class extends React.Component {
  static defaultProps = {
    maxLength: 7
  }

  getValue() {
    return this.props.value || ['']
  }

  onChange = (e, i) => {
    const value = this.getValue().slice()
    value[i] = e.target.value
    this.props.onChange(value)
  }

  handleAddInput = () => {
    const value = this.getValue().slice()
    value.push("")
    this.props.onChange(value)
  }

  handleHideInput = (index) => {
    const value = this.getValue()
    const filter = value.filter((key, i) => {
      return i !== index
    })
    this.props.onChange(filter)
  }

  renderAnswer = (value = this.getValue()) => {
    return value.map((exam, i) => {
      return (
        <div className="exam-content__answer" key={i}>
          <label className="exam-content__answer-label">{LABELS[i]}:</label>
          <Input.TextArea onChange={(e) => this.onChange(e, i)} value={exam} />
          {value.length > 1 &&
            <Icon onClick={() => this.handleHideInput(i)} type="hide-hover" className="exam-content__answer-icon" />
          }
        </div>
      )
    })
  }

  render() {
    return (
      <div>
        {this.renderAnswer()}
        {this.getValue().length < this.props.maxLength &&
          <div className="exam-content__answer-add-icon"><Icon onClick={this.handleAddInput} type="spread" /></div>
        }
      </div>

    )
  }
})
