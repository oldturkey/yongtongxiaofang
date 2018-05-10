import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Input, Popconfirm, Icon } from 'antd';
import styles from './editCell.less';

export default class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.type) {
      console.log(nextProps);
      this.setState({
        value: nextProps.value,
      });
    }
  }
  handleChange = e => {
    const value = e.target.value;
    this.setState({ value });
  };
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  };
  edit = () => {
    this.setState({ editable: true });
  };
  render() {
    const { value, editable } = this.state;
    return (
      <div className={styles.editable_cell}>
        {editable ? (
          <div className={styles.editable_cell_input_wrapper}>
            <Input value={value} onChange={this.handleChange} onPressEnter={this.check} />
            <Icon type="check" className={styles.editable_cell_icon_check} onClick={this.check} />
          </div>
        ) : (
          <div className={styles.editable_cell_text_wrapper}>
            {value || ' '}
            <Icon type="edit" className={styles.editable_cell_icon} onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}
