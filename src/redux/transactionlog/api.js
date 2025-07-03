//------------------------------------A P I-----------------------------------------------------------------
import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndPoint';

const api = new APICore();

function getLogApi(params) {
    const { search, page, limit } = params?.data;
    return api.get(`${URL.log}?search=${search}&page=${page}&limit=${limit}`);
}

export { getLogApi };
