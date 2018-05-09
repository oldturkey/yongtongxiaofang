import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Map, Markers } from 'react-amap';
import { Row, Col, Icon, Card, Tabs, DatePicker, Tooltip, Avatar, Cascader } from 'antd';
import numeral from 'numeral';
import { ChartCard, TimelineChart } from 'components/Charts';
import { getTimeDistance } from '../../utils/utils';

import styles from './Analysis.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

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

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class Analysis extends Component {
  state = {
    rangePickerValue: getTimeDistance('today'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
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
    const time = this.state.rangePickerValue;
    this.props.dispatch({
      type: 'chart/fetchCurrentDevice',
      payload: {
        deviceName: value[value.length - 1],
        beginTime: time[0].format('YYYY-MM-DD HH:mm'),
        endTime: time[1].format('YYYY-MM-DD HH:mm'),
      },
    });
  };
  handleRangePickerChange = value => {
    this.setState({ rangePickerValue: value });
    this.props.dispatch({
      type: 'chart/fetchCurrentDevice',
      payload: {
        deviceName: this.props.chart.deviceName,
        beginTime: value[0].format('YYYY-MM-DD HH:mm'),
        endTime: value[1].format('YYYY-MM-DD HH:mm'),
      },
    });
  };
  render() {
    const { rangePickerValue } = this.state;
    const { chart, loading } = this.props;
    const {
      devicebardata,
      deviceList,
      event,
      hydraulicPress,
      liquidLevel,
      chartData,
      Geolocation,
    } = chart;
    const center = Geolocation && Geolocation;
    const devicePostion =
      deviceList.length === 0
        ? []
        : deviceList.map(item => {
            if (item) {
              const position = {
                longitude: item.Geolocation.longitude,
                latitude: item.Geolocation.latitude,
              };
              return {
                position,
                myIndex: item.deviceName,
              };
            }
          });
    const deviceExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <Cascader options={options} onChange={this.onChange} placeholder="请选择设备地址" />
        </div>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 276 }}
        />
      </div>
    );

    const offlineChartData =
      chartData && chartData.length > 0
        ? chartData.map(item => {
            return {
              x: item.gmtCreate,
              y1: item.hydraulicPress,
              y2: item.liquidLevel,
            };
          })
        : [
            { x: new Date().getTime() + 1000 * 60 * 30 * 1, y1: 0, y2: 0 },
            { x: new Date().getTime() + 1000 * 60 * 30 * 20, y1: 0, y2: 0 },
          ];
    const nowData = [
      {
        title: '灭火器检测',
        value: event && event.extinguisherDetectPost,
      },
      {
        title: '漏水检测',
        value: event && event.waterLeakagePost,
      },
      {
        title: '水压值',
        value: hydraulicPress && hydraulicPress + ' KPa(千帕)',
      },
      {
        title: '液位值',
        value: liquidLevel && liquidLevel + ' m(米)',
      },
      {
        title: '水压报警',
        value: event && event.hydraulicPressAbnormalPost,
      },
      {
        title: '低液位报警',
        value: event && event.lowLiquildLevelPost,
      },
    ];
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
              total={() => (
                <span dangerouslySetInnerHTML={{ __html: devicebardata.allDeviceNumber }} />
              )}
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
              total={numeral(devicebardata.onlineDeviceNumber).format('0,0')}
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
              total={numeral(devicebardata.alertDeviceNumber).format('0,0')}
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
              total={devicebardata.monthAlertNumber}
              contentHeight={46}
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
                      <Map amapkey="38198245da7e8bc70e018e83d7b81e87" center={center}>
                        <Markers markers={devicePostion} />
                      </Map>
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <Row>
                      {nowData.map((item, i) => (
                        <Col
                          xl={12}
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          style={{ padding: 40 }}
                          key={i}
                        >
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
                          titleMap={{ y1: '水压值', y2: '液位值' }}
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
