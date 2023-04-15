import React, { useState, useEffect, useRef } from 'react';
import { List, Pagination, Segment, Header, Icon, Dropdown, Popup, Modal, Dimmer, Loader } from 'semantic-ui-react';
import { getArticlesFromSourceId, getLastArticles } from '../js/contentApi';
import useAuthToken from '../hooks/useAuthToken';
import useSourceIdContext from '../hooks/useSourceIdContext';


const rangeEnum = {
    0: 5,
    1: 10,
    2: 30,
    3: 50,
    4: 100,
}

function HomePage() {
    const [range, setRange] = useState(10);
    const [offset, setOffset] = useState(0);

    const [activePage, setActivePage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(1);

    const [articles, setArticles] = useState([]);
    const { sourceId, sourceTitle } = useSourceIdContext();

    const [detailedArticle, setDetailedArticle] = useState(null);

    const [loadedArticles, setLoadedArticles] = useState('loader');

    const { authToken } = useAuthToken();

    const [maxLength, setMaxLength] = useState(0);
    const listRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            if (sourceId) {
                const { data, count } = await getArticlesFromSourceId(authToken, range, offset, sourceId)
                setArticles(data);
                setNumberOfPages(Math.ceil(count / range));
            } else {
                const { data, count } = await getLastArticles(authToken, range, offset)
                setArticles(data);
                setNumberOfPages(Math.ceil(count / range));
            }
        }
        fetchData();

    }, [range, offset, sourceId]);

    useEffect(() => {
        setLoadedArticles(articles.length !== 0);
    }, [articles])

    useEffect(() => {
        const updateMaxLength = () => {
            if (loadedArticles) {
                const listWidth = listRef.current.offsetWidth;
                const charWidth = 6.5;
                const calculatedMaxLength = Math.floor(listWidth / charWidth);
                setMaxLength(calculatedMaxLength);
            }
        }
        updateMaxLength(); // initial calculation
        window.addEventListener('resize', updateMaxLength);
        return () => window.removeEventListener('resize', updateMaxLength);
    });

    const handleUnsubscribe = (sourceId) => () => {
        alert('UNSUBSCRIBED');
    }

    const handlePageChange = (e, { activePage }) => {
        setOffset(offset + range);
        setActivePage(activePage);
    }

    return (
        <>
            <Dimmer active={loadedArticles === 'loader'}>
                <Loader />
            </Dimmer>
            {
                !loadedArticles && <Header size='huge'>You need to subscribe to RSS sources !!</Header>
            }
            {loadedArticles && <>
                <Segment textAlign='left' style={{ position: 'sticky', top: 0, zIndex: 999, marginTop: '2vh', display: 'flex', justifyContent: 'space-between' }} inverted>
                    {sourceId && (
                        <div style={{ width: '90%' }}>
                            <b>{sourceTitle}</b>
                            <Popup content={`Unsubscribe from ${sourceTitle}`} trigger={
                                <Icon name='trash' style={{ marginLeft: '10px' }} onClick={handleUnsubscribe(sourceId)} />
                            } />
                        </div>
                    )}
                    {!sourceId && (
                        <div style={{ width: '90%' }}>
                            <b>Last publications</b>
                        </div>
                    )}
                    <Dropdown text='Page Size'>
                        <Dropdown.Menu>
                            {Object.keys(rangeEnum).map(key => (
                                <Dropdown.Item text={rangeEnum[key]} key={key} onClick={() => setRange(rangeEnum[key])} />
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Segment>
                <div style={{ textAlign: 'left', width: '80vw', margin: '2vh auto' }} ref={listRef}>
                    <List>
                        {articles.map(article => {
                            const publishedAt = new Date(article.publishedAt);
                            return (
                                <>
                                    <List.Item key={article.id} onClick={() => setDetailedArticle(article.id)}>
                                        <Segment>
                                            <List.Content>
                                                <List.Header style={{ display: 'flex' }}>
                                                    <div style={{ display: 'inline-flex' }}>
                                                        <Icon name='rss square' size='large' verticalAlign='middle' />
                                                        <Header as='a' href={article.link} target='_blank'>{article.title}</Header>
                                                    </div>
                                                    <span style={{ marginLeft: '20px' }}>{publishedAt.toDateString()}</span>
                                                </List.Header>
                                                <List.Description>{article.description.replace(/(<([^>]+)>)/ig, '').length <= maxLength ? article.description.replace(/(<([^>]+)>)/ig, '') : article.description.replace(/(<([^>]+)>)/ig, '').slice(0, maxLength) + '...'}</List.Description>
                                            </List.Content>
                                        </Segment>
                                    </List.Item>
                                    <Modal
                                        closeIcon
                                        onOpen={() => setDetailedArticle(article.id)}
                                        onClose={() => setDetailedArticle(false)}
                                        open={detailedArticle === article.id}
                                        dimmer={'blurring'}
                                    >
                                        <Modal.Header>{article.title}</Modal.Header>
                                        <Modal.Content>
                                            {publishedAt.toDateString()}
                                            <Modal.Description style={{ marginTop: '10px' }}>
                                                <span dangerouslySetInnerHTML={{ __html: article.description }} />
                                            </Modal.Description>
                                        </Modal.Content>
                                    </Modal>
                                </>
                            )
                        })}
                    </List>
                </div>
                <Pagination
                    style={{ position: 'sticky', bottom: 0, zIndex: 999, marginBottom: '2vh' }}
                    inverted
                    defaultActivePage={1}
                    totalPages={numberOfPages}
                    activePage={activePage}
                    onPageChange={handlePageChange}
                />
            </>
            }
        </>
    )
}

export default HomePage;
