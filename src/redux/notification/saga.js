//------------------------------------S A G A---------------------------------------------------------------
import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { NotificationActionTypes } from './constants';

import {
    // createNotificationApi, updateNotificationApi,
    getNotificationApi
} from './api';
// import ToastContainer from '../../helpers/toast/ToastContainer';
/**
 * Login the user
 * @param {*} payload - username and password
 */



function* getNotificationFunction(data) {
    try {
        yield put({
            type: NotificationActionTypes.GET_NOTIFICATION_LOADING,
            payload: {},
        });
        const response = yield call(getNotificationApi, data);
        if (response.data.status) {
            yield put({
                type: NotificationActionTypes.GET_NOTIFICATION_SUCCESS,
                payload: { ...response.data },
            });
        } else {
            yield put({
                type: NotificationActionTypes.GET_NOTIFICATION_ERROR,
                payload: { ...response.data },
            });
        }
    } catch (error) {
        yield put({
            type: NotificationActionTypes.GET_NOTIFICATION_ERROR,
            payload: error,
        });
    }
};


export function* watchNotificationData() {
    yield takeEvery(NotificationActionTypes.GET_NOTIFICATION_FIRST, getNotificationFunction);
}

function* notificationSaga() {
    yield all([
        fork(watchNotificationData)
    ]);
}

export default notificationSaga;


