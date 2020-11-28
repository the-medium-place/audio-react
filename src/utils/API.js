import axios from 'axios';

const API_URL = 'http://localhost:8080';

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
        // .then(res => res.json()).catch(err => null)
    },

    updateEarVals: function(userId,updateObj) {
        return axios.put(API_URL+'/api/users/'+userId, updateObj)
    }


}

export default API;

