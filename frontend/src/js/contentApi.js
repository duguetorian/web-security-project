import data from '../rss_example.json';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

let sourceContent = [
    { name: "Source#1", id: "1" },
    { name: "Source#2", id: "2" },
    { name: "Source#3", id: "3" },
    { name: "Source#4", id: "4" },
    { name: "Source#5", id: "5" },
    { name: "Source#6", id: "6" },
    { name: "Source#7", id: "7" },
    { name: "Source#8", id: "8" },
    { name: "Source#9", id: "9" },
    { name: "Source#10", id: "10" },
    { name: "Source#11", id: "11" },
    { name: "Source#12", id: "12" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
]


export const getSources = async (username, token) => {
    const response = await axios.get(`${API_URL}/api/user/sources`, { headers: { authorization: token, username } }).then(response => {
        console.log('RESPONSE SOURCES: ', response)
        return response;
    }).catch(error => console.log('ERROR SOURCES: ', error.response))
    return response.data;
    return sourceContent;
}

export const addSource = async (username, token, link) => {
    const headers = { username, authorization: token };
    try {
        let domain = new URL(link)
        const response = await axios.post(`${API_URL}/api/source/`, { link }, { headers }).then(response => {
            return response;
        })
        return response
    } catch (error) {
        return false
    }
}

export const getLastArticles = (username, token, range) => {
    const numberOfPages = 5;
    return { lastArticles: Array(range).fill(data), numberOfPages }
}
