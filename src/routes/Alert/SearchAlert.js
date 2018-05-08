import React from 'react';
import { Row, Col, Table, Icon, message, Cascader, DatePicker, Card, Tabs } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Dashboard/Analysis.less';
import { getTimeDistance } from '../../utils/utils';
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
            value: 'CMH8vNgy99sWbY9SDbNJ',
            label: 'CMH8vNgy99sWbY9SDbNJ',
          },
          {
            value: 'realDevice',
            label: 'realDevice',
          },
          {
            value: '0001',
            label: '0001',
          },
        ],
      },
    ],
  },
];

@connect(({ alert, loading }) => ({
  alert,
  loading: loading.effects['chart/fetchList'],
}))
export default class Alert extends React.Component {
  state = {
    rangePickerValue: getTimeDistance('today'),
    deviceName: '',
    data: this.props.alert.alertList,
  };
  componentWillReceiveProps(nextProps) {
    if ('alert' in nextProps) {
      const nextData = nextProps.alert.alertList.map((item, i) => {
        item.key = i;
        return item;
      });
      this.setState({
        data: nextData,
      });
    }
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const time = this.state.rangePickerValue;
    dispatch({
      type: 'alert/fetchCurrentDevice',
      payload: {
        deviceName: '',
        beginTime: time[0].format('YYYY-MM-DD HH:mm'),
        endTime: time[1].format('YYYY-MM-DD HH:mm'),
      },
    });
  }
  onChange = value => {
    const time = this.state.rangePickerValue;
    console.log(value);
    this.setState({ deviceName: value.length > 0 ? value : '' });
    this.props.dispatch({
      type: 'alert/fetchCurrentDevice',
      payload: {
        deviceName: value.length > 0 ? value[value.length - 1] : '',
        beginTime: time[0].format('YYYY-MM-DD HH:mm'),
        endTime: time[1].format('YYYY-MM-DD HH:mm'),
      },
    });
  };
  handleRangePickerChange = value => {
    this.setState({ rangePickerValue: value });
    this.props.dispatch({
      type: 'alert/fetchCurrentDevice',
      payload: {
        deviceName: this.state.deviceName === '' ? '' : this.state.deviceName[2],
        beginTime: value[0].format('YYYY-MM-DD HH:mm'),
        endTime: value[1].format('YYYY-MM-DD HH:mm'),
      },
    });
  };
  render() {
    const columns = [
      {
        title: '设备编号',
        dataIndex: 'deviceName',
        key: 'deviceName',
        render: text => <a href="#">{text}</a>,
      },
      {
        title: '设备位置',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '故障类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '故障描述',
        dataIndex: 'eventName',
        key: 'eventName',
      },
      {
        title: '事件参数',
        dataIndex: 'errorData',
        key: 'errorData',
      },
      {
        title: '发布时间',
        dataIndex: 'time',
        key: 'time',
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
    const { loading } = this.props;
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
                <div>
                  <Table columns={columns} dataSource={this.state.data} loading={loading} />
                </div>
              </TabPane>
              <TabPane tab="故障" key="error">
                <div>
                  <Table
                    columns={columns}
                    dataSource={this.state.data.filter(item => {
                      return item.type === 'error';
                    })}
                  />
                </div>
              </TabPane>
              <TabPane tab="告警" key="alarm">
                <div>
                  <Table
                    columns={columns}
                    dataSource={this.state.data.filter(item => {
                      return item.type === 'alert';
                    })}
                  />
                </div>
              </TabPane>
              <TabPane tab="信息" key="message">
                <div>
                  <Table
                    columns={columns}
                    dataSource={this.state.data.filter(item => {
                      return item.type === 'info';
                    })}
                  />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
