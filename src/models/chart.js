import {
  devicebardata,
  deviceList,
  devicepropsbydevicename,
  getdevicepropsbytimeanddevicename,
} from '../services/api';
import { getTimeDistance } from '../utils/utils';
export default {
  namespace: 'chart',

  state: {
    offlineChartData: [],
    devicebardata: [],
    deviceList: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const [ListRes, barDataRes] = yield [call(deviceList), call(devicebardata)];
      const response = yield call(devicepropsbydevicename, { deviceName: ListRes[0].deviceName });
      yield put({
        type: 'save',
        payload: { deviceList: ListRes, devicebardata: barDataRes, ...response },
      });
      const begin = getTimeDistance('today')[0].format('YYYY-MM-DD HH:mm');
      const end = getTimeDistance('today')[1].format('YYYY-MM-DD HH:mm');
      const getback = yield call(getdevicepropsbytimeanddevicename, {
        deviceName: ListRes[1].deviceName,
        beginTime: begin,
        endTime: end,
      });
      yield put({
        type: 'save',
        payload: { chartData: getback },
      });
    },
    *fetchCurrentDevice({ payload }, { call, put }) {
      const response = yield call(devicepropsbydevicename, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        offlineChartData: [],
        devicebardata: [],
        deviceList: [],
      };
    },
  },
};
