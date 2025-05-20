//------------------------------------A P I-----------------------------------------------------------------
import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndPoint';

const api = new APICore();


function getStockInDataApi(params) {
    const { search, page, limit } = params?.data
    return api.get(`${URL.GET_STOCKIN_DATA}?search=${search}&page=${page}&limit=${limit}`);
}

function createStockInApi(params) {
    const { data } = params
    return api.create(URL.CREATE_STOCKIN, data);
}

function updateStockInApi(params) {
    const { data } = params
    return api.update(URL.UPDATE_STOCKIN, data);
}

function deleteStockInApi(params) {
    const { data } = params
    return api.create(URL.DELETE_STOCKIN, data);
}

function getStockInByIdApi(params) {
    const { data } = params
    return api.get(`${URL.GET_STOCKIN_BY_ID}/${data}`);
}

function updateStockInProductApi(params) {
    const { data } = params
    return api.update(URL.EDIT_STOCKIN_PRODUCT, data);
}

function deleteStockInProductApi(params) {
    const { data } = params
    return api.create(URL.DELETE_STOCKIN_PRODUCT, data);
}

function createStockInProductApi(params) {
    const { data } = params
    return api.create(URL.CREATE_STOCKIN_PRODUCT, data);
}

export {
    getStockInDataApi,
    createStockInApi,
    updateStockInApi,
    deleteStockInApi,
    getStockInByIdApi,
    updateStockInProductApi,
    deleteStockInProductApi,
    createStockInProductApi,
};