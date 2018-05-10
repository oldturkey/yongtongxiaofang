import { getdevicelist, setdeviceparam } from '../services/api';
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
    fetchCurrent: [
      function* fn({ payload, callback }, { call, put }) {
        const result = yield call(setdeviceparam, payload);
        if (result.error == null) {
          const response = yield call(getdevicelist);
          yield put({
            type: 'save',
            payload: {
              deviceList: response,
            },
          });
          if (callback) callback();
        }
      },
      { type: 'takeLatest' },
    ],
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
