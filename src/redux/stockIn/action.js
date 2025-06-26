//------------------------------------A C T I O N S----------------------------------------------------
// @flow
import { StockInActionTypes } from './constants';

export const getStockInListActions = (data) => ({
    type: StockInActionTypes.STOCKIN_LIST_FIRST,
    data,
});

export const createStockInActions = (data) => ({
    type: StockInActionTypes.CREATE_STOCKIN_FIRST,
    data,
});

export const updateStockInActions = (data) => ({
    type: StockInActionTypes.UPDATE_STOCKIN_FIRST,
    data,
});

export const deleteStockInActions = (data) => ({
    type: StockInActionTypes.DELETE_STOCKIN_FIRST,
    data,
});

export const getStockInByIdActions = (data) => ({
    type: StockInActionTypes.GET_STOCKIN_FIRST,
    data,
});
//GET_STOCKIN_RESET

export const getStockInByIdActionsReset = (data) => ({
    type: StockInActionTypes.GET_STOCKIN_RESET,
    data,
});

export const updateStockInProductActions = (data) => ({
    type: StockInActionTypes.UPDATE_STOCKIN_PRODUCT_FIRST,
    data,
});

export const deleteStockInProductActions = (data) => {
    console.log(data, 'ASDD');
    return {
        type: StockInActionTypes.DELETE_STOCKIN_PRODUCT_FIRST,
        data,
    };
};

export const createStockInProductActions = (data) => ({
    type: StockInActionTypes.CREATE_STOCKIN_PRODUCT_FIRST,
    data,
});
