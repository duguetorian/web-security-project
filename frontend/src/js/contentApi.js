import axios from 'axios';
import { disconnect } from './auth';

const API_URL = process.env.REACT_APP_API_URL;

export const getSources = async (authToken) => {
    const headers = { username: authToken.user, authorization: authToken.token };
    const data = await axios.get(`${API_URL}/api/user/sources`, { headers }).then(response => {
        return response.data;
    }).catch(handleErrorStatus)
    if (data.length === 0) {
        return [{ id: '000', title: 'You need to add sources ...', disabled: true }];
    }
    return data;
}

export const addSource = async (authToken, link) => {
    const headers = { username: authToken.user, authorization: authToken.token };
    try {
        new URL(link)
        const response = await axios.post(`${API_URL}/api/source/`, { link }, { headers }).then(response => {
            return response;
        }).catch(handleErrorStatus)
        return response
    } catch (error) {
        return false
    }
}

export const getLastArticles = async (authToken, range, offset) => {
    const headers = { username: authToken.user, authorization: authToken.token };
    const data = await axios.get(`${API_URL}/api/article/latest/${range}/${offset}`, { headers }).then(response => {
        return response.data;
    }).catch(handleErrorStatus);
    return data
}

export const getArticlesFromSourceId = async (authToken, range, offset, sourceId) => {
    const headers = { username: authToken.user, authorization: authToken.token };
    const data = await axios.get(`${API_URL}/api/article/source/${sourceId}/${range}/${offset}`, { headers }).then(response => {
        return response.data
    }).catch(handleErrorStatus)
    return data
}

export const unsubscribeFromSource = async (authToken, sourceId) => {
    const headers = { username: authToken.user, authorization: authToken.token };
    const response = await axios.post(`${API_URL}/api/user/unsubscribe`, { sourceId }, { headers }).then(response => response)
        .catch(handleErrorStatus);
    return response;
}

const handleErrorStatus = error => {
    console.log('Error status: ', error.status, error);
    if (error.status === 401) {
        disconnect();
        return null;
    }
    else {
        disconnect();
        console.log('error: ', error)
        return error;
    }
}
