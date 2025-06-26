//------------------------------------R E D U C E R S-------------------------------------------------
import { StockActionTypes } from './constants';

const STOCK_LIST_INITIAL_STATE = {
    stockList: [],
    loading: false,
};

const stockListReducer = (state = STOCK_LIST_INITIAL_STATE, action) => {
    switch (action.type) {
        case StockActionTypes.STOCK_LIST_LOADING:
            return {
                stockList: state.stockList,
                loading: true,
            };
        case StockActionTypes.STOCK_LIST_SUCCESS:
            return {
                stockList: action.payload,
                loading: false,
            };
        case StockActionTypes.STOCK_LIST_ERROR:
            return {
                stockList: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

const CREATE_STOCK_INITIAL_STATE = {
    createStock: [],
    loading: false,
};

const createStockReducer = (state = CREATE_STOCK_INITIAL_STATE, action) => {
    switch (action.type) {
        case StockActionTypes.CREATE_STOCK_LOADING:
            return {
                createStock: state.createStock,
                loading: true,
            };
        case StockActionTypes.CREATE_STOCK_SUCCESS:
            return {
                createStock: action.payload,
                loading: false,
            };
        case StockActionTypes.CREATE_STOCK_RESET:
            return {
                createStock: [],
                loading: false,
            };
        case StockActionTypes.CREATE_STOCK_ERROR:
            return {
                createStock: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

const UPDATE_STOCK_INITIAL_STATE = {
    updateStock: [],
    loading: false,
};

const updateStockReducer = (state = UPDATE_STOCK_INITIAL_STATE, action) => {
    switch (action.type) {
        case StockActionTypes.UPDATE_STOCK_LOADING:
            return {
                updateStock: state.updateStock,
                loading: true,
            };
        case StockActionTypes.UPDATE_STOCK_SUCCESS:
            return {
                updateStock: action.payload,
                loading: false,
            };
        case StockActionTypes.UPDATE_STOCK_RESET:
            return {
                updateStock: [],
                loading: false,
            };
        case StockActionTypes.UPDATE_STOCK_ERROR:
            return {
                updateStock: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

const UPDATE_STOCK_PRODUCT_INITIAL_STATE = {
    updateStockProduct: [],
    loading: false,
};

const updateStockProductReducer = (state = UPDATE_STOCK_PRODUCT_INITIAL_STATE, action) => {
    switch (action.type) {
        case StockActionTypes.UPDATE_STOCK_PRODUCT_LOADING:
            return {
                updateStockProduct: state.updateStockProduct,
                loading: true,
            };
        case StockActionTypes.UPDATE_STOCK_PRODUCT_SUCCESS:
            return {
                updateStockProduct: action.payload,
                loading: false,
            };
        case StockActionTypes.UPDATE_STOCK_PRODUCT_RESET:
            return {
                updateStockProduct: [],
                loading: false,
            };
        case StockActionTypes.UPDATE_STOCK_PRODUCT_ERROR:
            return {
                updateStockProduct: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

const DELETE_STOCK_PRODUCT_INITIAL_STATE = {
    deleteStockProduct: [],
    loading: false,
};

const deleteStockProductReducer = (state = DELETE_STOCK_PRODUCT_INITIAL_STATE, action) => {
    switch (action.type) {
        case StockActionTypes.DELETE_STOCK_PRODUCT_LOADING:
            return {
                deleteStockProduct: state.deleteStockProduct,
                loading: true,
            };
        case StockActionTypes.DELETE_STOCK_PRODUCT_SUCCESS:
            return {
                deleteStockProduct: action.payload,
                loading: false,
            };
        case StockActionTypes.DELETE_STOCK_PRODUCT_ERROR:
            return {
                deleteStockProduct: action.payload,
                loading: false,
            };
        case StockActionTypes.DELETE_STOCK_PRODUCT_RESET:
            return {
                deleteStockProduct: [],
                loading: false,
            };
        default:
            return state;
    }
};

const GET_STOCK_INITIAL_STATE = {
    stockById: [],
    loading: false,
};

const stockByIdReducer = (state = GET_STOCK_INITIAL_STATE, action) => {
    switch (action.type) {
        case StockActionTypes.GET_STOCK_LOADING:
            return {
                stockById: state.stockById,
                loading: true,
            };
        case StockActionTypes.GET_STOCK_SUCCESS:
            return {
                stockById: action.payload,
                loading: false,
            };
        case StockActionTypes.GET_STOCK_ERROR:
            return {
                stockById: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

const CREATE_STOCK_PRODUCT_INITIAL_STATE = {
    createStockProduct: [],
    loading: false,
};

const createStockProductReducer = (state = CREATE_STOCK_PRODUCT_INITIAL_STATE, action) => {
    switch (action.type) {
        case StockActionTypes.CREATE_STOCK_PRODUCT_LOADING:
            return {
                createStockProduct: state.createStockProduct,
                loading: true,
            };
        case StockActionTypes.CREATE_STOCK_PRODUCT_SUCCESS:
            return {
                createStockProduct: action.payload,
                loading: false,
            };
        case StockActionTypes.CREATE_STOCK_PRODUCT_RESET:
            return {
                createStockProduct: [],
                loading: false,
            };
        case StockActionTypes.CREATE_STOCK_PRODUCT_ERROR:
            return {
                createStockProduct: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export {
    stockListReducer,
    createStockReducer,
    updateStockReducer,
    updateStockProductReducer,
    deleteStockProductReducer,
    stockByIdReducer,
    createStockProductReducer,
};
