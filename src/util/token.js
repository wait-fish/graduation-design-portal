// 存储用户信息和token
const TOKEN = "waitfish_token";

const getToken = () => JSON.parse(localStorage.getItem(TOKEN));
const setToken = info => localStorage.setItem(TOKEN, JSON.stringify(info));
const removeToken = () => localStorage.removeItem(TOKEN);
const isAuth = () => !!getToken();

export { getToken, setToken, removeToken, isAuth };