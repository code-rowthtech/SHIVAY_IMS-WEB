// @flow
import { APICore } from './apiCore';

const api = new APICore();

// account
function login(params: any): any {
    const baseUrl = '/api/login/user';
    return api.create(`${baseUrl}`, params);
}

function logout(): any {
    const baseUrl = '/logout/';
    return api.create(`${baseUrl}`, {});
}

function signup(params: any): any {
    const baseUrl = '/register/';
    return api.create(`${baseUrl}`, params);
}
///api/profile/forgotPassword
function forgotPassword(params: any): any {
    // const baseUrl = '/forget-password/';
    const baseUrl = 'api/profile/forgotPassword';
    return api.create(`${baseUrl}`, params);
}

function forgotPasswordConfirm(data): any {
    console.log(data, 'forgotPasswordConfirm');
    // const baseUrl = '/password/reset/confirm/';
    const baseUrl = '/api/profile/resetPassword';
    return api.create(`${baseUrl}`, data);
}

export { login, logout, signup, forgotPassword, forgotPasswordConfirm };
