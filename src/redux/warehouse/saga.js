//------------------------------------S A G A---------------------------------------------------------------
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { WarehouseActionTypes } from './constants';

import { createWarehouseApi, deleteWarehouseApi, getWarehouseListApi, searchWarehouseApi, updateWarehouseApi } from './api';
import ToastContainer from '../../helpers/toast/ToastContainer';
/**
 * Login the user
 * @param {*} payload - username and password
 */

// warehouse

function* createWarehouseFunction(data) {
    try {
        yield put({
            type: WarehouseActionTypes.CREATE_WAREHOUSE_LOADING,
            payload: {},
        });
        const response = yield call(createWarehouseApi, data);

        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: WarehouseActionTypes.CREATE_WAREHOUSE_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: WarehouseActionTypes.CREATE_WAREHOUSE_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: WarehouseActionTypes.CREATE_WAREHOUSE_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        ToastContainer(error, 'danger')
        yield put({
            type: WarehouseActionTypes.CREATE_WAREHOUSE_ERROR,
            payload: error,
        });
    }
}

function* getWarehouseFunction(data) {
    try {
        yield put({
            type: WarehouseActionTypes.GET_WAREHOUSE_LOADING,
            payload: {},
        });
        const response = yield call(getWarehouseListApi, data);

        if (response?.status === 200) {
            yield put({
                type: WarehouseActionTypes.GET_WAREHOUSE_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: WarehouseActionTypes.GET_WAREHOUSE_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: WarehouseActionTypes.GET_WAREHOUSE_ERROR,
            payload: error,
        });
    }
}

function* updateWarehouseFunction(data) {
    try {
        yield put({
            type: WarehouseActionTypes.UPDATE_WAREHOUSE_LOADING,
            payload: {},
        });
        const response = yield call(updateWarehouseApi, data);

        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: WarehouseActionTypes.UPDATE_WAREHOUSE_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: WarehouseActionTypes.UPDATE_WAREHOUSE_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: WarehouseActionTypes.UPDATE_WAREHOUSE_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        ToastContainer(error, 'danger')
        yield put({
            type: WarehouseActionTypes.UPDATE_WAREHOUSE_ERROR,
            payload: error,
        });
    }
}

function* deleteWarehouseFunction(data) {
    try {
        yield put({
            type: WarehouseActionTypes.DELETE_WAREHOUSE_LOADING,
            payload: {},
        });
        const response = yield call(deleteWarehouseApi, data);

        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'danger')

            yield put({
                type: WarehouseActionTypes.DELETE_WAREHOUSE_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: WarehouseActionTypes.DELETE_WAREHOUSE_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: WarehouseActionTypes.DELETE_WAREHOUSE_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: WarehouseActionTypes.DELETE_WAREHOUSE_ERROR,
            payload: error,
        });
    }
}

function* getWarehouseListFunction(data) {
    try {
        yield put({
            type: WarehouseActionTypes.SEARCH_WAREHOUSE_LOADING,
            payload: {},
        });
        const response = yield call(searchWarehouseApi, data);

        if (response?.status === 200) {
            yield put({
                type: WarehouseActionTypes.SEARCH_WAREHOUSE_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: WarehouseActionTypes.SEARCH_WAREHOUSE_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: WarehouseActionTypes.SEARCH_WAREHOUSE_ERROR,
            payload: error,
        });
    }
}

export function* watchCreateWarehouse() {
    yield takeEvery(WarehouseActionTypes.CREATE_WAREHOUSE_FIRST, createWarehouseFunction);
}

export function* watchGetWarehouse() {
    yield takeEvery(WarehouseActionTypes.GET_WAREHOUSE_FIRST, getWarehouseFunction);
}

export function* watchUpdateWarehouse() {
    yield takeEvery(WarehouseActionTypes.UPDATE_WAREHOUSE_FIRST, updateWarehouseFunction);
}

export function* watchDeleteWarehouse() {
    yield takeEvery(WarehouseActionTypes.DELETE_WAREHOUSE_FIRST, deleteWarehouseFunction);
}

export function* watchWarehouseList() {
    yield takeEvery(WarehouseActionTypes.SEARCH_WAREHOUSE_FIRST, getWarehouseListFunction);
}

function* warehouseSaga() {
    yield all([
        fork(watchCreateWarehouse),
        fork(watchGetWarehouse),
        fork(watchUpdateWarehouse),
        fork(watchDeleteWarehouse),
        fork(watchWarehouseList),


    ]);
}

export default warehouseSaga;


