//------------------------------------S A G A---------------------------------------------------------------
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { StockActionTypes } from './constants';

import { createStockApi, deleteStockProductApi, getStockByIdApi, getStockListApi, updateStockApi, updateStockProductApi } from './api';
import ToastContainer from '../../helpers/toast/ToastContainer';




function* getStockListFunction(data) {
    try {
        yield put({
            type: StockActionTypes.STOCK_LIST_LOADING,
            payload: {},
        });
        const response = yield call(getStockListApi, data);
        if (response?.status === 200) {
            yield put({
                type: StockActionTypes.STOCK_LIST_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: StockActionTypes.STOCK_LIST_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: StockActionTypes.STOCK_LIST_ERROR,
            payload: error,
        });
    }
}

function* createStockFunction(data) {
    try {
        yield put({
            type: StockActionTypes.CREATE_STOCK_LOADING,
            payload: {},
        });
        const response = yield call(createStockApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: StockActionTypes.CREATE_STOCK_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: StockActionTypes.CREATE_STOCK_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: StockActionTypes.CREATE_STOCK_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        ToastContainer(error, 'danger')
        yield put({
            type: StockActionTypes.CREATE_STOCK_ERROR,
            payload: error,
        });
    }
}

function* updateStockFunction(data) {
    try {
        yield put({
            type: StockActionTypes.UPDATE_STOCK_LOADING,
            payload: {},
        });
        const response = yield call(updateStockApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: StockActionTypes.UPDATE_STOCK_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: StockActionTypes.UPDATE_STOCK_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        ToastContainer(error, 'danger')
        yield put({
            type: StockActionTypes.UPDATE_STOCK_ERROR,
            payload: error,
        });
    }
}

function* updateStockProductFunction(data) {
    try {
        yield put({
            type: StockActionTypes.UPDATE_STOCK_PRODUCT_LOADING,
            payload: {},
        });
        const response = yield call(updateStockProductApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: StockActionTypes.UPDATE_STOCK_PRODUCT_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: StockActionTypes.UPDATE_STOCK_PRODUCT_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: StockActionTypes.UPDATE_STOCK_PRODUCT_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        // ToastContainer(error?.message || 'Something went wrong', 'danger')
        yield put({
            type: StockActionTypes.UPDATE_STOCK_PRODUCT_ERROR,
            payload: error,
        });
    }
}

function* deleteStockProductFunction(data) {
    try {
        yield put({
            type: StockActionTypes.DELETE_STOCK_PRODUCT_LOADING,
            payload: {},
        });
        const response = yield call(deleteStockProductApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'danger')
            yield put({
                type: StockActionTypes.DELETE_STOCK_PRODUCT_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: StockActionTypes.DELETE_STOCK_PRODUCT_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: StockActionTypes.DELETE_STOCK_PRODUCT_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: StockActionTypes.DELETE_STOCK_PRODUCT_ERROR,
            payload: error,
        });
    }
}

function* getStockByIdFunction(data) {
    try {
        yield put({
            type: StockActionTypes.GET_STOCK_LOADING,
            payload: {},
        });
        const response = yield call(getStockByIdApi, data);
        if (response?.status === 200) {
            yield put({
                type: StockActionTypes.GET_STOCK_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: StockActionTypes.GET_STOCK_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: StockActionTypes.GET_STOCK_ERROR,
            payload: error,
        });
    }
}

export function* watchUserListData() {
    yield takeEvery(StockActionTypes.STOCK_LIST_FIRST, getStockListFunction);
}

export function* watchCreateStockData() {
    yield takeEvery(StockActionTypes.CREATE_STOCK_FIRST, createStockFunction);
}

export function* watchUpdateStockData() {
    yield takeEvery(StockActionTypes.UPDATE_STOCK_FIRST, updateStockFunction);
}

export function* watchUpdateStockProductData() {
    yield takeEvery(StockActionTypes.UPDATE_STOCK_PRODUCT_FIRST, updateStockProductFunction);
}

export function* watchDeleteStockproductData() {
    yield takeEvery(StockActionTypes.DELETE_STOCK_PRODUCT_FIRST, deleteStockProductFunction);
}

export function* watchStockData() {
    yield takeEvery(StockActionTypes.GET_STOCK_FIRST, getStockByIdFunction);
}


function* stockSaga() {
    yield all([
        fork(watchUserListData),
        fork(watchCreateStockData),
        fork(watchUpdateStockData),
        fork(updateStockProductFunction),
        fork(deleteStockProductFunction),
        fork(watchStockData),

    ]);
}

export default stockSaga;


