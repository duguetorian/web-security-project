export const authenticate = (username, password, setAuthToken) => {
    setAuthToken({ user: username, token: 'not implemented'})
    return "success"
}

export const disconnect = (setAuthToken) => {
    setAuthToken({ user: null, token: null})
    window.location.reload(true);
    return "success"
}
