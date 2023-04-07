import React, { useState, useEffect } from 'react';
import { getLastArticles } from '../js/contentApi';
import ArticlePresentation from './ArticlePresentation';
import { Pagination } from 'semantic-ui-react';
import useAuthContext from '../hooks/useAuthContext';

function HomePage() {
    const pageSize = 5;
    const [activePage, setActivePage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [lastArticles, setLastArticles] = useState([]);

    const { username, token } = useAuthContext();
    useEffect(() => {
        const response =  getLastArticles(username, token, pageSize);
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
