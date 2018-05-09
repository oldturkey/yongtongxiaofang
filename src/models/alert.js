import { getcontacts, getalertlist } from '../services/api';
import { getTimeDistance } from '../utils/utils';
export default {
  namespace: 'alert',

  state: {
    alertUserData: [],
    alertList: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getcontacts);
      yield put({
        type: 'save',
        payload: {
          alertUserData: response,
        },
      });
    },
    fetchCurrentDevice: [
      function* fn({ payload }, { call, put }) {
        const response = yield call(getalertlist, payload);
        yield put({ type: 'save', payload: { alertList: response } });
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
        alertUserData: [],
        alertList: [],
      };
    },
  },
};
