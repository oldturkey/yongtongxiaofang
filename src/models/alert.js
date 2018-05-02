import { getcontacts } from '../services/api';

export default {
  namespace: 'alert',

  state: {
    alertUserData: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getcontacts);
      yield put({
        type: 'save',
        payload: {
          alertUserData: response.data,
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
        alertUserData: [],
      };
    },
  },
};
