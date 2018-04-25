import React from 'react';
import { Row, Col, Table, Icon, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

export default class Alert extends React.Component {
  render() {
    return <PageHeaderLayout title="报警查询" content="用于查询设备报警的历史记录。" />;
  }
}
