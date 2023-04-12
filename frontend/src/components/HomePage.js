import React, { useState, useEffect } from 'react';
import { getLastArticles } from '../js/contentApi';
import ArticlePresentation from './ArticlePresentation';
import { Pagination } from 'semantic-ui-react';
import useAuthToken from '../hooks/useAuthToken';

function HomePage() {
    const pageSize = 5;
    const [activePage, setActivePage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [lastArticles, setLastArticles] = useState([]);

    const { authToken } = useAuthToken();
    useEffect(() => {
        const response =  getLastArticles(authToken.username, authToken.token, pageSize);
        setLastArticles(response.lastArticles);
        setNumberOfPages(response.numberOfPages)
    }, [])
    return (
        <>
            {lastArticles.map((article) => <ArticlePresentation article={article} />)}
            <Pagination defaultActivePage={1} totalPages={numberOfPages} />
        </>
    )
}

export default HomePage;
