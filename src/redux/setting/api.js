import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndPoint';

const api = new APICore();

export function changeProfilePasswordApi(params) {
    const { data } = params;
    return api.create(URL.changeProfilePassword, data);
}
