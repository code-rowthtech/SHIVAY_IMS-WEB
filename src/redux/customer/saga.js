//------------------------------------S A G A---------------------------------------------------------------
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { CustomerActionTypes } from './constants';

import { createCustomerApi, deleteCustomerApi, getCustomerListApi, listingCustomerApi, updateCustomerApi } from './api';
import ToastContainer from '../../helpers/toast/ToastContainer';




function* getCustomerListFunction(data) {
    try {
        yield put({
            type: CustomerActionTypes.CUSTOMER_LIST_LOADING,
            payload: {},
        });
        const response = yield call(getCustomerListApi, data);
        if (response?.status === 200) {
            yield put({
                type: CustomerActionTypes.CUSTOMER_LIST_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: CustomerActionTypes.CUSTOMER_LIST_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: CustomerActionTypes.CUSTOMER_LIST_ERROR,
            payload: error,
        });
    }
}

function* createCustomerFunction(data) {
    try {
        yield put({
            type: CustomerActionTypes.CREATE_CUSTOMER_LOADING,
            payload: {},
        });
        const response = yield call(createCustomerApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: CustomerActionTypes.CREATE_CUSTOMER_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: CustomerActionTypes.CREATE_CUSTOMER_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: CustomerActionTypes.CREATE_CUSTOMER_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        ToastContainer(error, 'danger')
        yield put({
            type: CustomerActionTypes.CREATE_CUSTOMER_ERROR,
            payload: error,
        });
    }
}


function* updateCustomerFunction(data) {
    try {
        yield put({
            type: CustomerActionTypes.UPDATE_CUSTOMER_LOADING,
            payload: {},
        });
        const response = yield call(updateCustomerApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: CustomerActionTypes.UPDATE_CUSTOMER_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: CustomerActionTypes.UPDATE_CUSTOMER_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: CustomerActionTypes.UPDATE_CUSTOMER_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        ToastContainer(error, 'danger')
        yield put({
            type: CustomerActionTypes.UPDATE_CUSTOMER_ERROR,
            payload: error,
        });
    }
}

function* deleteCustomerFunction(data) {
    try {
        yield put({
            type: CustomerActionTypes.DELETE_CUSTOMER_LOADING,
            payload: {},
        });
        const response = yield call(deleteCustomerApi, data);
        if (response?.status === 200) {
            ToastContainer(response?.data?.message, 'success')
            yield put({
                type: CustomerActionTypes.DELETE_CUSTOMER_SUCCESS,
                payload: response.data,
            });
            yield put({
                type: CustomerActionTypes.DELETE_CUSTOMER_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: CustomerActionTypes.DELETE_CUSTOMER_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: CustomerActionTypes.DELETE_CUSTOMER_ERROR,
            payload: error,
        });
    }
}

function* listingCustomerFunction(data) {
    try {
        yield put({
            type: CustomerActionTypes.LISTING_CUSTOMER_LOADING,
            payload: {},
        });
        const response = yield call(listingCustomerApi, data);
        if (response?.status === 200) {
            yield put({
                type: CustomerActionTypes.LISTING_CUSTOMER_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: CustomerActionTypes.LISTING_CUSTOMER_ERROR,
                payload: response.data,
            });
        }
    } catch (error) {
        yield put({
            type: CustomerActionTypes.LISTING_CUSTOMER_ERROR,
            payload: error,
        });
    }
}

export function* watchCustomerListData() {
    yield takeEvery(CustomerActionTypes.CUSTOMER_LIST_FIRST, getCustomerListFunction);
}


export function* watchCreateCustomerData() {
    yield takeEvery(CustomerActionTypes.CREATE_CUSTOMER_FIRST, createCustomerFunction);
}

export function* watchUpdateCustomerData() {
    yield takeEvery(CustomerActionTypes.UPDATE_CUSTOMER_FIRST, updateCustomerFunction);
}

export function* watchDeleteCustomerData() {
    yield takeEvery(CustomerActionTypes.DELETE_CUSTOMER_FIRST, deleteCustomerFunction);
}

export function* watchListingCustomerData() {
    yield takeEvery(CustomerActionTypes.LISTING_CUSTOMER_FIRST, listingCustomerFunction);
}


function* customerSaga() {
    yield all([
        fork(watchCustomerListData),
        fork(watchCreateCustomerData),
        fork(watchUpdateCustomerData),
        fork(watchDeleteCustomerData),
        fork(watchListingCustomerData),

    ]);
}

export default customerSaga;


