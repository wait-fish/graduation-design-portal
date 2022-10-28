import axios from 'axios';

export const BASE_URL = 'http://localhost';

const API =  axios.create({ baseURL: BASE_URL });

export { API };