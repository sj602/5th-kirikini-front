export const loginAction = {
    request: 'LOGIN_REQUEST',
    success: 'LOGIN_SUCCESS',
    failure: 'LOGIN_FAILURE',
    logout: 'LOGOUT',
    method: 'LOGIN_METHOD'
};

export const loginRequest = () => ({
    type: loginAction.request
});

export const loginSuccess = () => ({
    type: loginAction.success
});

export const loginFailure = () => ({
    type: loginAction.failure
});

export const logout = () => ({
    type: loginAction.logout
});

export const loginMethod = (value) => ({
    type: loginAction.method,
    payload: value
})
