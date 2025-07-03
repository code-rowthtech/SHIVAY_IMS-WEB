import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { changeProfilePasswordConstants } from './constants';
import { changeProfilePasswordApi } from './api';

function* changeProfilePasswordSagaFunction(action) {
    try {
        yield put({
            type: changeProfilePasswordConstants.CHANGE_PROFILE_PASSWORD_LOADING,
        });

        const response = yield call(changeProfilePasswordApi, action);

        if (response.status === 200) {
            yield put({
                type: changeProfilePasswordConstants.CHANGE_PROFILE_PASSWORD_SUCCESS,
                payload: response,
            });
        } else {
            yield put({
                type: changeProfilePasswordConstants.CHANGE_PROFILE_PASSWORD_FAILURE,
                payload: response,
            });
        }
    } catch (error) {
        yield put({
            type: changeProfilePasswordConstants.CHANGE_PROFILE_PASSWORD_FAILURE,
            payload: error?.response || error,
        });
    }
}

export function* changeProfilePasswordWatcher() {
    yield takeEvery(changeProfilePasswordConstants.CHANGE_PROFILE_PASSWORD, changeProfilePasswordSagaFunction);
}

export default function* changeProfilePasswordSaga() {
    yield fork(changeProfilePasswordWatcher);
}
