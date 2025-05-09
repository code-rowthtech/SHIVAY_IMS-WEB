//------------------------------------R E D U C E R S-------------------------------------------------
import { StockInActionTypes } from "./constants"

const STOCKIN_LIST_INITIAL_STATE = {
    stockInList: [],
    loading: false
}

const stockInListReducer = (state = STOCKIN_LIST_INITIAL_STATE, action) => {

    switch (action.type) {
        case StockInActionTypes.STOCKIN_LIST_LOADING:
            return {
                stockInList: state.stockInList,
                loading: true
            }
        case StockInActionTypes.STOCKIN_LIST_SUCCESS:
            return {
                stockInList: action.payload,
                loading: false
            }
        case StockInActionTypes.STOCKIN_LIST_ERROR:
            return {
                stockInList: action.payload,
                loading: false
            }
        default: return state
    }
}

const CREATE_STOCKIN_INITIAL_STATE = {
    createStockIn: [],
    loading: false
}

const createStockInReducer = (state = CREATE_STOCKIN_INITIAL_STATE, action) => {

    switch (action.type) {
        case StockInActionTypes.CREATE_STOCKIN_LOADING:
            return {
                createStockIn: state.createStockIn,
                loading: true
            }
        case StockInActionTypes.CREATE_STOCKIN_SUCCESS:
            return {
                createStockIn: action.payload,
                loading: false
            }
        case StockInActionTypes.CREATE_STOCKIN_RESET:
            return {
                createStockIn: [],
                loading: false,
            };
        case StockInActionTypes.CREATE_STOCKIN_ERROR:
            return {
                createStockIn: action.payload,
                loading: false
            }
        default: return state
    }
}

const UPDATE_STOCKIN_INITIAL_STATE = {
    updateStockIn: [],
    loading: false
}

const updateStockInReducer = (state = UPDATE_STOCKIN_INITIAL_STATE, action) => {

    switch (action.type) {
        case StockInActionTypes.UPDATE_STOCKIN_LOADING:
            return {
                updateStockIn: state.updateStockIn,
                loading: true
            }
        case StockInActionTypes.UPDATE_STOCKIN_SUCCESS:
            return {
                updateStockIn: action.payload,
                loading: false
            }
        case StockInActionTypes.UPDATE_STOCKIN_RESET:
            return {
                updateStockIn: [],
                loading: false,
            };
        case StockInActionTypes.UPDATE_STOCKIN_ERROR:
            return {
                updateStockIn: action.payload,
                loading: false
            }
        default: return state
    }
}

const DELETE_STOCKIN_INITIAL_STATE = {
    deleteStockIn: [],
    loading: false
}

const deleteStockInReducer = (state = DELETE_STOCKIN_INITIAL_STATE, action) => {

    switch (action.type) {
        case StockInActionTypes.DELETE_STOCKIN_LOADING:
            return {
                deleteStockIn: state.deleteStockIn,
                loading: true
            }
        case StockInActionTypes.DELETE_STOCKIN_SUCCESS:
            return {
                deleteStockIn: action.payload,
                loading: false
            }
        case StockInActionTypes.DELETE_STOCKIN_ERROR:
            return {
                deleteStockIn: action.payload,
                loading: false
            }
        case StockInActionTypes.DELETE_STOCKIN_RESET:
            return {
                deleteStockIn: [],
                loading: false
            }
        default: return state
    }
}

const GET_STOCKIN_INITIAL_STATE = {
    stockInById: [],
    loading: false
}

const stockInByIdReducer = (state = GET_STOCKIN_INITIAL_STATE, action) => {

    switch (action.type) {
        case StockInActionTypes.GET_STOCKIN_LOADING:
            return {
                stockInById: state.stockInById,
                loading: true
            }
        case StockInActionTypes.GET_STOCKIN_SUCCESS:
            return {
                stockInById: action.payload,
                loading: false
            }
        case StockInActionTypes.GET_STOCKIN_ERROR:
            return {
                stockInById: action.payload,
                loading: false
            }
        default: return state
    }
}

const UPDATE_STOCKIN_PRODUCT_INITIAL_STATE = {
    updateStockInProduct: [],
    loading: false
}

const updateStockInProductReducer = (state = UPDATE_STOCKIN_PRODUCT_INITIAL_STATE, action) => {

    switch (action.type) {
        case StockInActionTypes.UPDATE_STOCKIN_PRODUCT_LOADING:
            return {
                updateStockInProduct: state.updateStockInProduct,
                loading: true
            }
        case StockInActionTypes.UPDATE_STOCKIN_PRODUCT_SUCCESS:
            return {
                updateStockInProduct: action.payload,
                loading: false
            }
        case StockInActionTypes.UPDATE_STOCKIN_PRODUCT_RESET:
            return {
                updateStockInProduct: [],
                loading: false,
            };
        case StockInActionTypes.UPDATE_STOCKIN_PRODUCT_ERROR:
            return {
                updateStockInProduct: action.payload,
                loading: false
            }
        default: return state
    }
}

const DELETE_STOCKIN_PRODUCT_INITIAL_STATE = {
    deleteStockInProduct: [],
    loading: false
}

const deleteStockInProductReducer = (state = DELETE_STOCKIN_PRODUCT_INITIAL_STATE, action) => {

    switch (action.type) {
        case StockInActionTypes.DELETE_STOCKIN_PRODUCT_LOADING:
            return {
                deleteStockInProduct: state.deleteStockInProduct,
                loading: true
            }
        case StockInActionTypes.DELETE_STOCKIN_PRODUCT_SUCCESS:
            return {
                deleteStockInProduct: action.payload,
                loading: false
            }
        case StockInActionTypes.DELETE_STOCKIN_PRODUCT_ERROR:
            return {
                deleteStockInProduct: action.payload,
                loading: false
            }
        case StockInActionTypes.DELETE_STOCKIN_PRODUCT_RESET:
            return {
                deleteStockInProduct: [],
                loading: false
            }
        default: return state
    }
}

const CREATE_STOCKIN_PRODUCT_INITIAL_STATE = {
    createStockInProduct: [],
    loading: false
}

const createStockInProductReducer = (state = CREATE_STOCKIN_PRODUCT_INITIAL_STATE, action) => {

    switch (action.type) {
        case StockInActionTypes.CREATE_STOCKIN_PRODUCT_LOADING:
            return {
                createStockInProduct: state.createStockInProduct,
                loading: true
            }
        case StockInActionTypes.CREATE_STOCKIN_PRODUCT_SUCCESS:
            return {
                createStockInProduct: action.payload,
                loading: false
            }
        case StockInActionTypes.CREATE_STOCKIN_PRODUCT_RESET:
            return {
                createStockInProduct: [],
                loading: false,
            };
        case StockInActionTypes.CREATE_STOCKIN_PRODUCT_ERROR:
            return {
                createStockInProduct: action.payload,
                loading: false
            }
        default: return state
    }
}

export {
    stockInListReducer,
    createStockInReducer,
    updateStockInReducer,
    deleteStockInReducer,
    stockInByIdReducer,
    updateStockInProductReducer,
    deleteStockInProductReducer,
    createStockInProductReducer,
}