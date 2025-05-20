//------------------------------------S A G A---------------------------------------------------------------
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { RoleActionTypes } from './constants';

import { getRolesListApi } from './api';




function* getRolesListFunction(data) {
    try {
        yield put({
            type: RoleActionTypes.ROLES_LIST_LOADING,
            payload: {},
        });
        const response = yield call(getRolesListApi, data);
        if (response?.status === 200) {
            yield put({
                type: RoleActionTypes.ROLES_LIST_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: RoleActionTypes.ROLES_LIST_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: RoleActionTypes.ROLES_LIST_ERROR,
            payload: error,
        });
    }
}

export function* watchRolesListData() {
    yield takeEvery(RoleActionTypes.ROLES_LIST_FIRST, getRolesListFunction);
}

function* roleSaga() {
    yield all([
        fork(watchRolesListData)
    ]);
}

export default roleSaga;


