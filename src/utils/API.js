import axios from 'axios';

const API_URL = 'http://localhost:8080';

export default {

    createUser: function (userObj){
        return axios.post(API_URL+'/api/users', userObj)
    },

    getUser: function (){},

    updateEarVals: function() {}


}

