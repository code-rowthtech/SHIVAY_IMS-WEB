//------------------------------------S A G A---------------------------------------------------------------
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { logActionTypes } from './constants';
import { getLogApi } from './api';

function* getLogListFunction(data) {
    try {
        yield put({
            type: logActionTypes.LOG_LIST_LOADING,
            payload: {},
        });
        const response = yield call(getLogApi, data);
        if (response?.status === 200) {
            yield put({
                type: logActionTypes.LOG_LIST_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: logActionTypes.LOG_LIST_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: logActionTypes.LOG_LIST_ERROR,
            payload: error,
        });
    }
}

export function* watchgetLogListFunction() {
    yield takeEvery(logActionTypes.LOG_LIST_FIRST, getLogListFunction);
}

function* logSaga() {
    yield all([fork(watchgetLogListFunction)]);
}

export default logSaga;
