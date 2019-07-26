import axios from 'axios'
let root = '/api'
export function getInfo(options = {}){
    return axios.post(root+'/goldcard/getElectronicInvoice',options);
}
export function sendInfo(options = {}){
    return axios.post(root+'/goldcard/doElectronicInvoice',options);
}