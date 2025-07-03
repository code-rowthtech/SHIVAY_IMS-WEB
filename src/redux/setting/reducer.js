import { changeProfilePasswordConstants } from './constants';

const initial_state = {
    data: null,
    message: '',
    loading: false,
};

export const changeProfilePasswordReducer = (state = initial_state, action) => {
    switch (action.type) {
        case changeProfilePasswordConstants.CHANGE_PROFILE_PASSWORD:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case changeProfilePasswordConstants.CHANGE_PROFILE_PASSWORD_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
                error: null,
            };
        case changeProfilePasswordConstants.CHANGE_PROFILE_PASSWORD_FAILURE:
            return {
                ...state,
                loading: false,
                data: action?.payload,
                error: action?.payload,
            };
        case changeProfilePasswordConstants.CHANGE_PROFILE_PASSWORD_RESET:
            return initial_state;
        default:
            return state;
    }
};
