import axios from 'axios';

axios.defaults.baseURL = 'https://api-corner-44c2f4d4313e.herokuapp.com';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
