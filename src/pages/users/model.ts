import { UserItem } from './data.d';
import { message } from 'antd';
import { Reducer, Effect, Subscription } from 'umi';
import { getRemoteList, editRecord, deleteRecord, addRecord } from './service'

/**
 * model 是一个对象
 */

export interface UserState {
  data: UserItem[],
  meta: {
    total: number
    per_page: number
    page: number
  }
}

interface UserModelType {
  namespace: 'users',
  state: UserState,
  reducers: {
    getList: Reducer<UserState>
  },
  effects: {
    getRemote: Effect,
    edit: Effect,
    delete: Effect,
    add: Effect,
  },
  subscriptions: {
    setup: Subscription
  }
}

const UserModel: UserModelType = {
  namespace: 'users',
  state: {
    data: [],
    meta: {
      total: 0,
      per_page: 5,
      page: 1
    }
  },
  // 同步
  reducers: {
    // aciton就是 action => {type,payload}
    // getList(state,action) { return newState }
    getList(state, { payload }) {
      return payload
    }
  },
  // 异步
  effects: {
    // / *getList (action,effects) {yield put(xx)}
    *getRemote(action, { put, call }) {
      const data = yield call(getRemoteList)
      if (data) {
        yield put({ type: 'getList', payload: data })
      }
    },
    *edit({ payload: { id, values } }, { put, call }) {
      const data = yield call(editRecord, { id, values })
      if (data) {
        message.success('Edit Successfully.')
        yield put({ type: 'getRemote' })
      } else {
        message.error('Edit Failed')
      }
    },
    *delete({ payload }, { put, call }) {
      const data = yield call(deleteRecord, payload)
      if (data) {
        message.success('Delete Successully.')
        yield put({ type: 'getRemote' })
      } else {
        message.error('Delete Failed')
      }
    },
    *add({ payload: { values } }, { put, call }) {
      const data = yield call(addRecord, { values })
      if (data) {
        message.success('Add Successfully.')
        yield put({ type: 'getRemote' })
      } else {
        message.error('Add Failed')
      }
    },
  },
  // 订阅
  subscriptions: {
    // getList({ dispatch, history }, done) { }
    // 同步
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname }) => {
    //     if (pathname === '/users') {
    //       dispatch({ type: 'getList' })
    //     }
    //   })
    // }
    // 异步
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({ type: 'getRemote' })
        }
      })
    }
  }
}

export default UserModel
