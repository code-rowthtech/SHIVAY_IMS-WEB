//------------------------------------A C T I O N S----------------------------------------------------
// @flow
import { logActionTypes } from './constants';

export const logListActions = (data) => ({
    type: logActionTypes.LOG_LIST_FIRST,
    data,
});
