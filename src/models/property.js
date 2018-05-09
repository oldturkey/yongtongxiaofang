import { getdevicelist } from '../services/api';
export default {
  namespace: 'property',

  state: {
    deviceList: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getdevicelist);
      yield put({
        type: 'save',
        payload: {
          deviceList: response,
        },
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
        deviceList: [],
      };
    },
  },
};
