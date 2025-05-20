//------------------------------------S A G A---------------------------------------------------------------
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { LocationActionTypes } from './constants';
import { getLocationApi } from './api';





function* getLocationFunction(data) {
    try {
        yield put({
            type: LocationActionTypes.LOCATION_LOADING,
            payload: {},
        });
        const response = yield call(getLocationApi, data);
        if (response?.status === 200) {
            yield put({
                type: LocationActionTypes.LOCATION_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: LocationActionTypes.LOCATION_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: LocationActionTypes.LOCATION_ERROR,
            payload: error,
        });
    }
}

export function* watchLocationData() {
    yield takeEvery(LocationActionTypes.LOCATION_FIRST, getLocationFunction);
}

function* locationSaga() {
    yield all([
        fork(watchLocationData)
    ]);
}

export default locationSaga;


