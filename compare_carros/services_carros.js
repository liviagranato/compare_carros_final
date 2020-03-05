const express = require('express');
const app = express();
const axios = require('axios');




module.exports.requestGet = async function(endpoint){
    let responseFinal;
    await axios.get(endpoint)
        .then(function(response){
            responseFinal = response;
        });  

    return responseFinal;
}

module.exports.requestPost = async function(endpoint, params){
    await axios.post(endpoint, { 
        params: params
    })
        .then(function(response){
            return response;
        });  
}   