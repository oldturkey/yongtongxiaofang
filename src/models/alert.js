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
    *fetchCurrentDevice({ payload }, { call, put, race }) {
      const { response } = yield race({
        response: call(getalertlist, payload),
      });
      // const response = yield call(getalertlist, payload);
      if (response)
        yield put({
          type: 'save',
          payload: { alertList: response },
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
        alertUserData: [],
        alertList: [],
      };
    },
  },
};
