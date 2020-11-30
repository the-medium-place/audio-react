import axios from 'axios';

// const API_URL = 'http://localhost:8080';
const API_URL = 'https://zgstowell-audiology-api.herokuapp.com';

const API = {

    createUser: function (userObj){
        return axios.post(API_URL+'/api/users', userObj)
    },

    userLogin: function (userObj){
        return axios.post(API_URL+'/api/users/login', userObj)
    },

    getProfile: function(token){
        return axios.get(API_URL + '/api/users/secretProfile', {
            headers:{
                "authorization":`Bearer ${token}`
            }
        })
    },

    updateEarVals: function(userId,updateObj) {
        return axios.put(API_URL+'/api/users/'+userId, updateObj)
    },

    saveRecording: function(audioObj, userId) {
        return axios.post(API_URL+'/api/blobs/'+userId, audioObj)
    },

    deleteRecording: function(blobId) {
        return axios.delete(API_URL+'/api/blobs/delete/'+blobId)
    }
}

export default API;

