import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const authenticate = async (username, password, setAuthToken) => {
    let success = true;
    await axios.post(`${API_URL}/api/user/authenticate`, { username, password }).then(response => {
        if (response.data.message === 'ok') {
            setAuthToken({ user: response.data.username, token: response.data.token })
        }
        else {
            success = false
        }
    }).catch(error => {
        console.log(error.response);
        success = false
    })
    return success
}

export const createUser = async (username, password) => {
    const response = await axios.post(`${API_URL}/api/user/create`, { username, password }).then(response => {
        console.log('RESPONSE: ', response, '\nTEST: ', response.data.message === 'ok')
        if (response.data.message === 'ok') {
            return 'ok';
        }
        if ('error' in response.data) {
            return response.data.error
        }
        return 'error';
    }).catch(error => {
        console.log(error.response)
        return 'error';
    })
    return response;
}

export const disconnect = (setAuthToken) => {
    setAuthToken({ user: null, token: null })
    window.location.reload(true);
    return "success"
}
