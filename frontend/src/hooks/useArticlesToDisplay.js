import { useState } from "react";

const useArticlesToDisplay = () => {
    const getArticlesToDisplay = () => {
        const tokenString = sessionStorage.getItem('authToken');
        const authToken = JSON.parse(tokenString);
        return authToken
    }

    const saveArticlesToDisplay = authToken => {
        sessionStorage.setItem('authToken', JSON.stringify(authToken));
        setAuthToken(authToken);
    };

    const [articlesToDisplay, setArticlesToDisplay] = useState(getArticlesToDisplay())

    return {
        setArticlesToDisplay: saveArticlesToDisplay,
        authToken,
    };
};

export default useArticlesToDisplay;
