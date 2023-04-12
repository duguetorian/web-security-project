import { useState } from "react";

const useAuthToken = () => {
    const getAuthToken = () => {
        const tokenString = sessionStorage.getItem('authToken');
        const authToken = JSON.parse(tokenString);
        return authToken
    }

    const saveAuthToken = authToken => {
        sessionStorage.setItem('authToken', JSON.stringify(authToken));
        setAuthToken(authToken);
    };

    const [authToken, setAuthToken] = useState(getAuthToken())

    return {
        setAuthToken: saveAuthToken,
        authToken,
    };
};

export default useAuthToken;
