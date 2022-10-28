// ID列表缓存操作，文章详细页的切换页面操作
const ID_LIST = "waitfish_article_id_list";

const getIDList = () => JSON.parse(sessionStorage.getItem(ID_LIST));
const setIDList = id_list => sessionStorage.setItem(ID_LIST, JSON.stringify(id_list));
const removeIDList = ()=> sessionStorage.removeItem(ID_LIST);
const isIDList = () => !!getIDList(); // 是否有列表

export { getIDList, setIDList, removeIDList, isIDList };