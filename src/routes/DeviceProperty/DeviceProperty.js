import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  Button,
  Input,
  message,
  Popconfirm,
  Divider,
  Form,
  Card,
  Tabs,
  Cascader,
  Icon,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Dashboard/Analysis.less';
import EditableCell from './EditableCell';
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

@connect(({ property, loading }) => ({
  property,
  loading: loading.effects['property/fetch'],
}))
@Form.create()
export default class DeviceProperty extends Component {
  state = {
    data: this.props.property.deviceList,
    loading: false,
  };
  componentWillReceiveProps(nextProps) {
    if ('property' in nextProps) {
      const nextData = nextProps.property.deviceList.map((item, i) => {
        item.key = i;
        return item;
      });
      this.setState({
        data: nextData,
      });
    }
  }
  // user &&
  //   user.map((item, i) => {
  //     item.key = i;
  //   });
  componentDidMount() {
    this.props.dispatch({
      type: 'property/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'property/clear',
    });
  }
  onChange = value => {
    const time = this.state.rangePickerValue;
    this.setState({ deviceName: value.length > 0 ? value : '' });
  };
  onCellChange = (deviceName, dataIndex, hydata) => {
    const { dispatch } = this.props;
    return value => {
      switch (dataIndex) {
        case 'lowLiquildLevelThreshold':
          dispatch({
            type: 'property/fetchCurrent',
            payload: {
              deviceName: deviceName,
              setParam: [
                {
                  method: 'liquidLevelThresholdSet',
                  inputParams: { liquidLevelThreshold: parseFloat(value) },
                },
              ],
            },
            callback: () => {
              message.success('修改成功');
            },
          });

          break;
        case 'reportingPeriod':
          dispatch({
            type: 'property/fetchCurrent',
            payload: {
              deviceName: deviceName,
              setParam: [
                {
                  method: 'uploadFrequencySet',
                  inputParams: {
                    uploadFrequency: parseInt(value),
                  },
                },
              ],
            },
            callback: () => {
              message.success('修改成功');
            },
          });
          break;
        case 'hydraulicPressUpThreshold':
          dispatch({
            type: 'property/fetchCurrent',
            payload: {
              deviceName: deviceName,
              setParam: [
                {
                  method: 'hydraulicPressThresholdSet',
                  inputParams: {
                    hydraulicPressUpperThreshold: parseFloat(value),
                    hydraulicPressLowThreshold: parseFloat(hydata),
                  },
                },
              ],
            },
            callback: () => {
              message.success('修改成功');
            },
          });
          break;
        case 'hydraulicPressDownThreshold':
          dispatch({
            type: 'property/fetchCurrent',
            payload: {
              deviceName: deviceName,
              setParam: [
                {
                  method: 'hydraulicPressThresholdSet',
                  inputParams: {
                    hydraulicPressUpperThreshold: parseFloat(hydata),
                    hydraulicPressLowThreshold: parseFloat(value),
                  },
                },
              ],
            },
            callback: () => {
              message.success('修改成功');
            },
          });
          break;
        default:
          break;
      }
    };
  };

  render() {
    const { loading } = this.props;
    const columns = [
      {
        title: '设备编号',
        dataIndex: 'deviceName',
        key: 'deviceName',
        width: '10%',
        align: 'center',
      },
      {
        title: '设备位置',
        dataIndex: 'location',
        key: 'location',
        width: '20%',
        align: 'center',
      },
      {
        title: '硬件版本号',
        dataIndex: 'softVersion',
        key: 'softVersion',
        width: '10%',
        align: 'center',
      },
      {
        title: '液位报警阈值',
        dataIndex: 'lowLiquildLevelThreshold',
        key: 'lowLiquildLevelThreshold',
        width: '15%',
        align: 'center',
        render: (text, record) => {
          return (
            <EditableCell
              value={text}
              type="propertyChange"
              onChange={this.onCellChange(record.deviceName, 'lowLiquildLevelThreshold')}
            />
          );
        },
      },
      {
        title: '水压报警阈值上限',
        dataIndex: 'hydraulicPressUpThreshold',
        key: 'hydraulicPressUpThreshold',
        width: '15%',
        align: 'center',
        render: (text, record) => {
          return (
            <EditableCell
              value={text}
              type="propertyChange"
              onChange={this.onCellChange(
                record.deviceName,
                'hydraulicPressUpThreshold',
                record.hydraulicPressDownThreshold
              )}
            />
          );
        },
      },
      {
        title: '水压报警阈值下限',
        dataIndex: 'hydraulicPressDownThreshold',
        key: 'hydraulicPressDownThreshold',
        width: '15%',
        align: 'center',
        render: (text, record) => {
          return (
            <EditableCell
              value={text}
              type="propertyChange"
              onChange={this.onCellChange(
                record.deviceName,
                'hydraulicPressDownThreshold',
                record.hydraulicPressUpThreshold
              )}
            />
          );
        },
      },
      {
        title: '属性上报周期',
        dataIndex: 'reportingPeriod',
        key: 'reportingPeriod',
        width: '15%',
        align: 'center',
        render: (text, record) => {
          return (
            <EditableCell
              value={text}
              type="propertyChange"
              onChange={this.onCellChange(record.deviceName, 'reportingPeriod')}
            />
          );
        },
      },
    ];
    const deviceExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra} style={{ marginRight: 240 }}>
          <Cascader options={options} onChange={this.onChange} placeholder="请选择设备地址" />
        </div>
      </div>
    );
    return (
      <PageHeaderLayout title="设备属性" content="用于查询/设置设备属性">
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={deviceExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="设备属性" key="all">
                <div>
                  <Table
                    loading={this.state.loading}
                    columns={columns}
                    dataSource={this.state.data}
                    pagination={false}
                    rowClassName={record => {
                      return record.editable ? styles.editable : '';
                    }}
                    bordered
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
