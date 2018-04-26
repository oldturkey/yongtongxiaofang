import React from 'react';
import { Row, Col, Table, Icon, message, Cascader, DatePicker, Card, Tabs } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Dashboard/Analysis.less';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const options = [
  {
    value: '浙江',
    label: '浙江',
    children: [
      {
        value: '杭州',
        label: '杭州',
        children: [
          {
            value: '西湖',
            label: '西湖',
          },
        ],
      },
    ],
  },
  {
    value: '江苏',
    label: '江苏',
    children: [
      {
        value: '南京',
        label: '南京',
        children: [
          {
            value: '中华门',
            label: '中华门',
          },
        ],
      },
    ],
  },
];
const data = [
  {
    key: '1',
    deviceid: '1111111',
    location: 32,
    errorType: '3',
  },
];
export default class Alert extends React.Component {
  render() {
    const columns = [
      {
        title: '设备编号',
        dataIndex: 'deviceid',
        key: 'deviceid',
        render: text => <a href="#">{text}</a>,
      },
      {
        title: '设备位置',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '故障类型',
        dataIndex: 'errorType',
        key: 'errorType',
      },
      {
        title: '故障描述',
        dataIndex: 'errordetial',
        key: 'errordetial',
      },
      {
        title: '事件参数',
        dataIndex: 'errorData',
        key: 'errorData',
      },
      {
        title: '发布数件',
        dataIndex: 'errorTime',
        key: 'errorTime',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href="#">删除</a>
          </span>
        ),
      },
    ];
    const { chart, loading } = this.props;
    const deviceExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <Cascader options={options} onChange={this.onChange} placeholder="请选择设备地址" />
        </div>
        <RangePicker onChange={this.handleRangePickerChange} style={{ width: 256 }} />
      </div>
    );
    return (
      <PageHeaderLayout title="报警查询" content="用于查询设备报警的历史记录。">
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={deviceExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="全部报警" key="all">
                <div style={{ height: 450 }}>
                  <Table columns={columns} dataSource={data} />
                </div>
              </TabPane>
              <TabPane tab="故障" key="error">
                <div style={{ height: 450 }}>
                  <Table columns={columns} dataSource={[]} />
                </div>
              </TabPane>
              <TabPane tab="告警" key="alarm">
                <div style={{ height: 450 }}>
                  <Table columns={columns} dataSource={[]} />
                </div>
              </TabPane>
              <TabPane tab="信息" key="message">
                <div style={{ height: 450 }}>
                  <Table columns={columns} dataSource={[]} />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
