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
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Dashboard/Analysis.less';

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
    // this.props.dispatch({
    //   type: 'alert/fetchCurrentDevice',
    //   payload: {
    //     deviceName: value.length > 0 ? value[value.length - 1] : '',
    //     beginTime: time[0].format('YYYY-MM-DD HH:mm'),
    //     endTime: time[1].format('YYYY-MM-DD HH:mm'),
    //   },
    // });
  };
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  index = 0;
  cacheOriginData = {};
  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.phone || !target.name || !target.detial || !target.email) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
      this.setState({
        loading: false,
      });
    }, 500);
  }
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
    this.clickedCancel = false;
  }
  render() {
    const { loading } = this.props;
    const columns = [
      {
        title: '设备编号',
        dataIndex: 'deviceName',
        key: 'deviceName',
      },
      {
        title: '设备位置',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '硬件版本号',
        dataIndex: 'softVersion',
        key: 'softVersion',
      },
      {
        title: '液位报警阈值',
        dataIndex: 'liquidLevelThreshold',
        key: 'liquidLevelThreshold',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'liquidLevelThreshold', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="液位报警阈值"
              />
            );
          }
          return text;
        },
      },
      {
        title: '水压报警阈值',
        dataIndex: 'hydraulicPressUpperThreshold',
        key: 'hydraulicPressUpperThreshold',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e =>
                  this.handleFieldChange(e, 'hydraulicPressUpperThreshold', record.key)
                }
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="水压报警阈值"
              />
            );
          }
          return text;
        },
      },
      {
        title: '属性上报周期',
        dataIndex: 'reportingPeriod',
        key: 'reportingPeriod',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'reportingPeriod', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="属性上报周期"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
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
    console.log(this.state.data);
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
