//------------------------------------R E D U C E R S-------------------------------------------------
import { InventoryActionTypes } from "./constants"

const PRODUCT_LIST_INITIAL_STATE = {
    productList: [],
    loading: false
}

const productListReducer = (state = PRODUCT_LIST_INITIAL_STATE, action) => {

    switch (action.type) {
        case InventoryActionTypes.PRODUCT_LIST_LOADING:
            return {
                productList: state.productList,
                loading: true
            }
        case InventoryActionTypes.PRODUCT_LIST_SUCCESS:
            return {
                productList: action.payload,
                loading: false
            }
        case InventoryActionTypes.PRODUCT_LIST_ERROR:
            return {
                productList: action.payload,
                loading: false
            }
        default: return state
    }
}

const CREATE_PRODUCT_INITIAL_STATE = {
    createProduct: [],
    loading: false
}

const createProductReducer = (state = CREATE_PRODUCT_INITIAL_STATE, action) => {

    switch (action.type) {
        case InventoryActionTypes.CREATE_PRODUCT_LOADING:
            return {
                createProduct: state.createProduct,
                loading: true
            }
        case InventoryActionTypes.CREATE_PRODUCT_SUCCESS:
            return {
                createProduct: action.payload,
                loading: false
            }
        case InventoryActionTypes.CREATE_PRODUCT_RESET:
            return {
                createProduct: [],
                loading: false,
            };
        case InventoryActionTypes.CREATE_PRODUCT_ERROR:
            return {
                createProduct: action.payload,
                loading: false
            }
        default: return state
    }
}

const UPDATE_PRODUCT_INITIAL_STATE = {
    updateProduct: [],
    loading: false
}

const updateProductReducer = (state = UPDATE_PRODUCT_INITIAL_STATE, action) => {

    switch (action.type) {
        case InventoryActionTypes.UPDATE_PRODUCT_LOADING:
            return {
                updateProduct: state.updateProduct,
                loading: true
            }
        case InventoryActionTypes.UPDATE_PRODUCT_SUCCESS:
            return {
                updateProduct: action.payload,
                loading: false
            }
        case InventoryActionTypes.UPDATE_PRODUCT_RESET:
            return {
                updateProduct: [],
                loading: false,
            };
        case InventoryActionTypes.UPDATE_PRODUCT_ERROR:
            return {
                updateProduct: action.payload,
                loading: false
            }
        default: return state
    }
}

const DELETE_PRODUCT_INITIAL_STATE = {
    deleteProduct: [],
    loading: false
}

const deleteProductReducer = (state = DELETE_PRODUCT_INITIAL_STATE, action) => {

    switch (action.type) {
        case InventoryActionTypes.DELETE_PRODUCT_LOADING:
            return {
                deleteProduct: state.deleteProduct,
                loading: true
            }
        case InventoryActionTypes.DELETE_PRODUCT_SUCCESS:
            return {
                deleteProduct: action.payload,
                loading: false
            }
        case InventoryActionTypes.DELETE_PRODUCT_ERROR:
            return {
                deleteProduct: action.payload,
                loading: false
            }
        case InventoryActionTypes.DELETE_PRODUCT_RESET:
            return {
                deleteProduct: [],
                loading: false
            }
        default: return state
    }
}

const SEARCH_PRODUCT_INITIAL_STATE = {
    searchProduct: [],
    loading: false
}

const searchProductReducer = (state = SEARCH_PRODUCT_INITIAL_STATE, action) => {

    switch (action.type) {
        case InventoryActionTypes.SEARCH_PRODUCT_LOADING:
            return {
                searchProduct: state.searchProduct,
                loading: true
            }
        case InventoryActionTypes.SEARCH_PRODUCT_SUCCESS:
            return {
                searchProduct: action.payload,
                loading: false
            }
        case InventoryActionTypes.SEARCH_PRODUCT_ERROR:
            return {
                searchProduct: action.payload,
                loading: false
            }
        default: return state
    }
}

const VIEW_PRODUCT_INITIAL_STATE = {
    viewProduct: [],
    loading: false
}

const viewProductReducer = (state = VIEW_PRODUCT_INITIAL_STATE, action) => {

    switch (action.type) {
        case InventoryActionTypes.VIEW_PRODUCT_LOADING:
            return {
                viewProduct: state.viewProduct,
                loading: true
            }
        case InventoryActionTypes.VIEW_PRODUCT_SUCCESS:
            return {
                viewProduct: action.payload,
                loading: false
            }
        case InventoryActionTypes.VIEW_PRODUCT_ERROR:
            return {
                viewProduct: action.payload,
                loading: false
            }
        default: return state
    }
}

const SEARCH_PRODUCT_NAME_INITIAL_STATE = {
    searchProductName: [],
    loading: false
}

const searchProductNameReducer = (state = SEARCH_PRODUCT_NAME_INITIAL_STATE, action) => {

    switch (action.type) {
        case InventoryActionTypes.SEARCH_PRODUCT_NAME_LOADING:
            return {
                searchProductName: state.searchProductName,
                loading: true
            }
        case InventoryActionTypes.SEARCH_PRODUCT_NAME_SUCCESS:
            return {
                searchProductName: action.payload,
                loading: false
            }
        case InventoryActionTypes.SEARCH_PRODUCT_NAME_ERROR:
            return {
                searchProductName: action.payload,
                loading: false
            }
        default: return state
    }
}
export {
    productListReducer,
    createProductReducer,
    updateProductReducer,
    deleteProductReducer,
    searchProductReducer,
    viewProductReducer,
    searchProductNameReducer,
}