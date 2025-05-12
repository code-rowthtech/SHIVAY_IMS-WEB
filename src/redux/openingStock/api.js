//------------------------------------A P I-----------------------------------------------------------------
import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndPoint';

const api = new APICore();


function getStockListApi(params) {
    const { search, page, limit } = params?.data
    return api.get(`${URL.GET_STOCK_LIST}?search=${search}&page=${page}&limit=${limit}`);
}

function createStockApi(params) {
    const { data } = params
    return api.create(URL.CREATE_STOCK, data);
}

function updateStockApi(params) {
    const { data } = params
    return api.create(URL.UPDATE_STOCK, data);
}

function updateStockProductApi(params) {
    const { data } = params
    return api.create(URL.EDIT_STOCK_PRODUCT, data);
}

function deleteStockProductApi(params) {
    const { data } = params
    return api.create(URL.DELETE_STOCK_PRODUCT, data);
}

function getStockByIdApi(params) {
    const { data } = params
    return api.get(`${URL.GET_STOCK_BY_ID}/${data}`);
}

export {
    getStockListApi,
    createStockApi,
    updateStockApi,
    updateStockProductApi,
    deleteStockProductApi,
    getStockByIdApi,
};