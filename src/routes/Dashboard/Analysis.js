import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Map } from 'react-amap';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
  Avatar,
  Cascader,
  message,
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from 'components/Charts';
import Trend from 'components/Trend';
import NumberInfo from 'components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';

import styles from './Analysis.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}
const nowData = [
  {
    title: '灭火器检测',
    value: 1,
  },
  {
    title: '漏水检测',
    value: 0,
  },
  {
    title: '水压值',
    value: '10KPA',
  },
  {
    title: '液位值',
    value: 1,
  },
  {
    title: '水压报警',
    value: 1,
  },
  {
    title: '低液位报警',
    value: 1,
  },
];
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

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    center: { longitude: 115, latitude: 30 },
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  onChange = value => {
    console.log(value);
  };

  selectDate = type => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { chart, loading } = this.props;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;

    const salesPieData =
      salesType === 'all'
        ? salesTypeData
        : salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;

    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const deviceExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <Cascader options={options} onChange={this.onChange} placeholder="请选择设备地址" />
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    const columns = [
      {
        title: '排名',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '搜索关键词',
        dataIndex: 'keyword',
        key: 'keyword',
        render: text => <a href="/">{text}</a>,
      },
      {
        title: '用户数',
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: '周涨幅',
        dataIndex: 'range',
        key: 'range',
        sorter: (a, b) => a.range - b.range,
        render: (text, record) => (
          <Trend flag={record.status === 1 ? 'down' : 'up'}>
            <span style={{ marginRight: 4 }}>{text}%</span>
          </Trend>
        ),
        align: 'right',
      },
    ];

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    return (
      <Fragment>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="设备总数"
              avatar={<Avatar size="large" icon="eye" />}
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <span dangerouslySetInnerHTML={{ __html: 126560 }} />}
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="在线设备数"
              avatar={<Avatar size="large" icon="global" />}
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="报警设备数"
              avatar={<Avatar size="large" icon="bulb" />}
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(6560).format('0,0')}
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="本月报警数"
              avatar={<Avatar size="large" icon="bulb" />}
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total="78%"
              contentHeight={numeral(6560).format('0,0')}
            />
          </Col>
        </Row>

        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={deviceExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="设备实时数据" key="now">
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar} style={{ height: 450 }}>
                      <Map
                        center={{ longitude: 126.637174, latitude: 45.722127 }}
                        amapkey={'38198245da7e8bc70e018e83d7b81e87'}
                        center={this.state.center}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <Row>
                      {nowData.map((item, i) => (
                        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: 40 }}>
                          <h4>{item.title}</h4>
                          <p style={{ color: 'rgb(31,130,255)' }}>
                            {item.value === 1 ? '是' : item.value === 0 ? '否' : item.value}
                          </p>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="设备历史数据曲线图" key="history">
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar} style={{ height: 450 }}>
                      <div style={{ padding: '0 24px' }}>
                        <TimelineChart
                          height={400}
                          data={offlineChartData}
                          titleMap={{ y1: '水压值', y2: '液位值', y3: '灭火器监测' }}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </Fragment>
    );
  }
}
