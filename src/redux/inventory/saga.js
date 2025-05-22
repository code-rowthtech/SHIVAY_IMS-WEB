//------------------------------------S A G A---------------------------------------------------------------
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { InventoryActionTypes } from './constants';
import {
    createProductApi,
    deleteProductApi,
    getProductListApi,
    searchProductApi,
    searchProductNameApi,
    updateProductApi,
    viewProductApi,
    viewProductStockApi
} from './api';
import ToastContainer from '../../helpers/toast/ToastContainer';


function* getProductListFunction(data) {
    try {
        yield put({
            type: InventoryActionTypes.PRODUCT_LIST_LOADING,
            payload: {},
        });
        const response = yield call(getProductListApi, data);
        if (response?.status === 200) {
            yield put({
                type: InventoryActionTypes.PRODUCT_LIST_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: InventoryActionTypes.PRODUCT_LIST_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: InventoryActionTypes.PRODUCT_LIST_ERROR,
            payload: error,
        });
    }
}

function* createProductFunction(data) {
    try {
        yield put({
            type: InventoryActionTypes.CREATE_PRODUCT_LOADING,
            payload: {},
        });
        const response = yield call(createProductApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: InventoryActionTypes.CREATE_PRODUCT_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: InventoryActionTypes.CREATE_PRODUCT_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: InventoryActionTypes.CREATE_PRODUCT_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        ToastContainer(error, 'danger')
        yield put({
            type: InventoryActionTypes.CREATE_PRODUCT_ERROR,
            payload: error,
        });
    }
}

function* updateProductFunction(data) {
    try {
        yield put({
            type: InventoryActionTypes.UPDATE_PRODUCT_LOADING,
            payload: {},
        });
        const response = yield call(updateProductApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: InventoryActionTypes.UPDATE_PRODUCT_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: InventoryActionTypes.UPDATE_PRODUCT_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: InventoryActionTypes.UPDATE_PRODUCT_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        ToastContainer(error, 'danger')
        yield put({
            type: InventoryActionTypes.UPDATE_PRODUCT_ERROR,
            payload: error,
        });
    }
}

function* deleteProductFunction(data) {
    try {
        yield put({
            type: InventoryActionTypes.DELETE_PRODUCT_LOADING,
            payload: {},
        });
        const response = yield call(deleteProductApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: InventoryActionTypes.DELETE_PRODUCT_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: InventoryActionTypes.DELETE_PRODUCT_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: InventoryActionTypes.DELETE_PRODUCT_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: InventoryActionTypes.DELETE_PRODUCT_ERROR,
            payload: error,
        });
    }
}

function* searchProductFunction(data) {
    try {
        yield put({
            type: InventoryActionTypes.SEARCH_PRODUCT_LOADING,
            payload: {},
        });
        const response = yield call(searchProductApi, data);
        if (response?.status === 200) {
            // ToastContainer(response?.data?.message, 'success')
            yield put({
                type: InventoryActionTypes.SEARCH_PRODUCT_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: InventoryActionTypes.SEARCH_PRODUCT_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: InventoryActionTypes.SEARCH_PRODUCT_ERROR,
            payload: error,
        });
    }
}

function* viewProductFunction(data) {
    try {
        yield put({
            type: InventoryActionTypes.VIEW_PRODUCT_LOADING,
            payload: {},
        });
        const response = yield call(viewProductApi, data);
        if (response?.status === 200) {
            yield put({
                type: InventoryActionTypes.VIEW_PRODUCT_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: InventoryActionTypes.VIEW_PRODUCT_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: InventoryActionTypes.VIEW_PRODUCT_ERROR,
            payload: error,
        });
    }
}

function* searchProductNameFunction(data) {
    try {
        yield put({
            type: InventoryActionTypes.SEARCH_PRODUCT_NAME_LOADING,
            payload: {},
        });
        const response = yield call(searchProductNameApi, data);
        if (response?.status === 200) {
            // ToastContainer(response?.data?.message, 'success')
            yield put({
                type: InventoryActionTypes.SEARCH_PRODUCT_NAME_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: InventoryActionTypes.SEARCH_PRODUCT_NAME_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: InventoryActionTypes.SEARCH_PRODUCT_NAME_ERROR,
            payload: error,
        });
    }
}

function* viewProductStockFunction(data) {
    try {
        yield put({
            type: InventoryActionTypes.VIEW_PRODUCT_STOCK_LOADING,
            payload: {},
        });
        const response = yield call(viewProductStockApi, data);
        if (response?.status === 200) {
            yield put({
                type: InventoryActionTypes.VIEW_PRODUCT_STOCK_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: InventoryActionTypes.VIEW_PRODUCT_STOCK_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: InventoryActionTypes.VIEW_PRODUCT_STOCK_ERROR,
            payload: error,
        });
    }
}

export function* watchProductListData() {
    yield takeEvery(InventoryActionTypes.PRODUCT_LIST_FIRST, getProductListFunction);
}

export function* watchCreateProductData() {
    yield takeEvery(InventoryActionTypes.CREATE_PRODUCT_FIRST, createProductFunction);
}

export function* watchUpdateProductData() {
    yield takeEvery(InventoryActionTypes.UPDATE_PRODUCT_FIRST, updateProductFunction);
}

export function* watchDeleteProductData() {
    yield takeEvery(InventoryActionTypes.DELETE_PRODUCT_FIRST, deleteProductFunction);
}

export function* watchSearchProductData() {
    yield takeEvery(InventoryActionTypes.SEARCH_PRODUCT_FIRST, searchProductFunction);
}

export function* watchViewProductData() {
    yield takeEvery(InventoryActionTypes.VIEW_PRODUCT_FIRST, viewProductFunction);
}

export function* watchSearchProductNameData() {
    yield takeEvery(InventoryActionTypes.SEARCH_PRODUCT_NAME_FIRST, searchProductNameFunction);
}

export function* watchViewProductStock() {
    yield takeEvery(InventoryActionTypes.VIEW_PRODUCT_STOCK_FIRST, viewProductStockFunction);
}

function* inventorySaga() {
    yield all([
        fork(watchProductListData),
        fork(watchCreateProductData),
        fork(watchUpdateProductData),
        fork(watchDeleteProductData),
        fork(watchSearchProductData),
        fork(watchViewProductData),
        fork(watchSearchProductNameData),
        fork(watchViewProductStock),

    ]);
}

export default inventorySaga;


