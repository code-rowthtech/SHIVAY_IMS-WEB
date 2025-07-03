//------------------------------------R E D U C E R S-------------------------------------------------
import { logActionTypes } from './constants';

const SUPPLIER_LIST_INITIAL_STATE = {
    supplierList: [],
    loading: false,
};

const logListReducer = (state = SUPPLIER_LIST_INITIAL_STATE, action) => {
    switch (action.type) {
        case logActionTypes.LOG_LIST_LOADING:
            return {
                supplierList: state.supplierList,
                loading: true,
            };
        case logActionTypes.LOG_LIST_SUCCESS:
            return {
                supplierList: action.payload,
                loading: false,
            };
        case logActionTypes.LOG_LIST_ERROR:
            return {
                supplierList: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export { logListReducer };
