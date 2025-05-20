//------------------------------------S A G A---------------------------------------------------------------
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { ReportActionTypes } from './constants';
import { getReportApi } from './api';





function* getReportFunction(data) {
    try {
        yield put({
            type: ReportActionTypes.REPORT_LOADING,
            payload: {},
        });
        const response = yield call(getReportApi, data);
        if (response?.status === 200) {
            yield put({
                type: ReportActionTypes.REPORT_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: ReportActionTypes.REPORT_ERROR,
                payload: response.data,
            });
            yield put({
                type: ReportActionTypes.REPORT_RESET,
                payload: {},
            });
        }
    } catch (error) {
        yield put({
            type: ReportActionTypes.REPORT_ERROR,
            payload: error,
        });
    }
}

export function* watchReportData() {
    yield takeEvery(ReportActionTypes.REPORT_FIRST, getReportFunction);
}

function* reportSaga() {
    yield all([
        fork(watchReportData)
    ]);
}

export default reportSaga;


