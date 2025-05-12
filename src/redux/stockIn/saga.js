//------------------------------------S A G A---------------------------------------------------------------
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { StockInActionTypes } from './constants';

import { createStockInApi, createStockInProductApi, deleteStockInApi, deleteStockInProductApi, getStockInByIdApi, getStockInDataApi, updateStockInApi, updateStockInProductApi } from './api';
import ToastContainer from '../../helpers/toast/ToastContainer';




function* getStockInListFunction(data) {
    try {
        yield put({
            type: StockInActionTypes.STOCKIN_LIST_LOADING,
            payload: {},
        });
        const response = yield call(getStockInDataApi, data);
        if (response?.status === 200) {
            yield put({
                type: StockInActionTypes.STOCKIN_LIST_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: StockInActionTypes.STOCKIN_LIST_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: StockInActionTypes.STOCKIN_LIST_ERROR,
            payload: error,
        });
    }
}

function* createStockInFunction(data) {
    try {
        yield put({
            type: StockInActionTypes.CREATE_STOCKIN_LOADING,
            payload: {},
        });
        const response = yield call(createStockInApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: StockInActionTypes.CREATE_STOCKIN_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: StockInActionTypes.CREATE_STOCKIN_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: StockInActionTypes.CREATE_STOCKIN_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        ToastContainer(error, 'danger')
        yield put({
            type: StockInActionTypes.CREATE_STOCKIN_ERROR,
            payload: error,
        });
    }
}

function* updateStockInFunction(data) {
    try {
        yield put({
            type: StockInActionTypes.UPDATE_STOCKIN_LOADING,
            payload: {},
        });
        const response = yield call(updateStockInApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: StockInActionTypes.UPDATE_STOCKIN_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: StockInActionTypes.UPDATE_STOCKIN_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: StockInActionTypes.UPDATE_STOCKIN_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        ToastContainer(error, 'danger')
        yield put({
            type: StockInActionTypes.UPDATE_STOCKIN_ERROR,
            payload: error,
        });
    }
}

function* deleteStockInFunction(data) {
    try {
        yield put({
            type: StockInActionTypes.DELETE_STOCKIN_LOADING,
            payload: {},
        });
        const response = yield call(deleteStockInApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'danger')
            yield put({
                type: StockInActionTypes.DELETE_STOCKIN_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: StockInActionTypes.DELETE_STOCKIN_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: StockInActionTypes.DELETE_STOCKIN_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: StockInActionTypes.DELETE_STOCKIN_ERROR,
            payload: error,
        });
    }
}

function* getStockInByIdFunction(data) {
    try {
        yield put({
            type: StockInActionTypes.GET_STOCKIN_LOADING,
            payload: {},
        });
        const response = yield call(getStockInByIdApi, data);
        if (response?.status === 200) {
            yield put({
                type: StockInActionTypes.GET_STOCKIN_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: StockInActionTypes.GET_STOCKIN_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: StockInActionTypes.GET_STOCKIN_ERROR,
            payload: error,
        });
    }
}

function* updateStockInProductFunction(data) {
    try {
        yield put({
            type: StockInActionTypes.UPDATE_STOCKIN_PRODUCT_LOADING,
            payload: {},
        });
        const response = yield call(updateStockInProductApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: StockInActionTypes.UPDATE_STOCKIN_PRODUCT_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: StockInActionTypes.UPDATE_STOCKIN_PRODUCT_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: StockInActionTypes.UPDATE_STOCKIN_PRODUCT_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        ToastContainer(error, 'danger')
        yield put({
            type: StockInActionTypes.UPDATE_STOCKIN_PRODUCT_ERROR,
            payload: error,
        });
    }
}

function* deleteStockInProductFunction(data) {
    try {
        yield put({
            type: StockInActionTypes.DELETE_STOCKIN_PRODUCT_LOADING,
            payload: {},
        });
        const response = yield call(deleteStockInProductApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'danger')
            yield put({
                type: StockInActionTypes.DELETE_STOCKIN_PRODUCT_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: StockInActionTypes.DELETE_STOCKIN_PRODUCT_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: StockInActionTypes.DELETE_STOCKIN_PRODUCT_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: StockInActionTypes.DELETE_STOCKIN_PRODUCT_ERROR,
            payload: error,
        });
    }
}

function* createStockInProductFunction(data) {
    try {
        yield put({
            type: StockInActionTypes.CREATE_STOCKIN_PRODUCT_LOADING,
            payload: {},
        });
        const response = yield call(createStockInProductApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: StockInActionTypes.CREATE_STOCKIN_PRODUCT_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: StockInActionTypes.CREATE_STOCKIN_PRODUCT_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: StockInActionTypes.CREATE_STOCKIN_PRODUCT_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        ToastContainer(error, 'danger')
        yield put({
            type: StockInActionTypes.CREATE_STOCKIN_PRODUCT_ERROR,
            payload: error,
        });
    }
}

export function* watchUserListData() {
    yield takeEvery(StockInActionTypes.STOCKIN_LIST_FIRST, getStockInListFunction);
}

export function* watchCreateStockInData() {
    yield takeEvery(StockInActionTypes.CREATE_STOCKIN_FIRST, createStockInFunction);
}

export function* watchUpdateStockInData() {
    yield takeEvery(StockInActionTypes.UPDATE_STOCKIN_FIRST, updateStockInFunction);
}

export function* watchDeleteStockInData() {
    yield takeEvery(StockInActionTypes.DELETE_STOCKIN_FIRST, deleteStockInFunction);
}

export function* watchStockInData() {
    yield takeEvery(StockInActionTypes.GET_STOCKIN_FIRST, getStockInByIdFunction);
}

export function* watchUpdateStockInProductData() {
    yield takeEvery(StockInActionTypes.UPDATE_STOCKIN_PRODUCT_FIRST, updateStockInProductFunction);
}

export function* watchDeleteStockInProductData() {
    yield takeEvery(StockInActionTypes.DELETE_STOCKIN_PRODUCT_FIRST, deleteStockInProductFunction);
}

export function* watchCreateStockInProductData() {
    yield takeEvery(StockInActionTypes.CREATE_STOCKIN_PRODUCT_FIRST, createStockInProductFunction);
}

function* stockInSaga() {
    yield all([
        fork(watchUserListData),
        fork(watchCreateStockInData),
        fork(watchUpdateStockInData),
        fork(watchDeleteStockInData),
        fork(watchStockInData),
        fork(watchUpdateStockInProductData),
        fork(watchDeleteStockInProductData),
        fork(watchCreateStockInProductData),


    ]);
}

export default stockInSaga;


