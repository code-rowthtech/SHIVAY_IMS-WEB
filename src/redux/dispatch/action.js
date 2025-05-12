//------------------------------------A C T I O N S----------------------------------------------------
// @flow
import { DispatchActionTypes } from './constants';


export const getDispatchListActions = (data) => ({
    type: DispatchActionTypes.GET_DISPATCH_LIST,
    data
});

export const createDispatchActions = (data) => ({
    type: DispatchActionTypes.CREATE_DISPATCH_FIRST,
    data
});


export const updateDispatchActions = (data) => ({
    type: DispatchActionTypes.UPDATE_DISPATCH_FIRST,
    data
});

export const deleteDispatchActions = (data) => ({
    type: DispatchActionTypes.DELETE_DISPATCH_FIRST,
    data
});

export const createStockCheckActions = (data) => ({
    type: DispatchActionTypes.CREATE_STOCK_CHECK_FIRST,
    data
});

export const updateDispatchProductActions = (data) => ({
    type: DispatchActionTypes.UPDATE_DISPATCH_PRODUCT_FIRST,
    data
});

export const deleteDispatchProductActions = (data) => ({
    type: DispatchActionTypes.DELETE_DISPATCH_PRODUCT_FIRST,
    data
});

export const getDispatchByIdActions = (data) => ({
    type: DispatchActionTypes.GET_DISPATCH_FIRST,
    data
});

export const createDispatchProductActions = (data) => ({
    type: DispatchActionTypes.CREATE_DISPATCH_PRODUCT_FIRST,
    data
});