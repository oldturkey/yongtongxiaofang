import { devicebardata, deviceList } from '../services/api';

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
      yield put({
        type: 'save',
        payload: { deviceList: ListRes, devicebardata: barDataRes },
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
