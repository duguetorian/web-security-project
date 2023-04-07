export const authenticate = (username, password, setUser, setToken) => {
    setUser(username);
    setToken("not implemented");
    return "success"
}

export const disconnect = (setUser, setToken) => {
    setUser(null);
    setToken(null);
    return "success"
}
