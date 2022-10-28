import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { API, BASE_URL, getToken, isAuth } from '../../util'
import "./index.scss";

class Control extends Component {
  state = {
    searchBox: "none",
    put: "0",
    searchClose: "scale(0.2)",
    isLogin: false,
    avatar: ""
  };

  componentDidMount() {
    window.onkeydown = function (e) {
      if (e.key === "Enter") return false;
    }
    this.getLoginInfo();
  }

  render() {
    const { avatar, isLogin } = this.state;
    return (<>
      {this.search()}
      <div id="control" onMouseOver={this.getLoginInfo}>
        <div className="control_bg">
          <span className="iconfont icon-chakanguanliandekongzhiliu"></span>
        </div>
        <div className="control_bg dl" style={{ background: isLogin ? "#fff" : "#F0F0F0" }}>
          {
            isLogin ? <Link to="/oneself"><img src={BASE_URL + avatar} alt="" /></Link> : <Link to="/login"><span className="iconfont icon-denglu"></span></Link>
          }
        </div>
        <div className="control_bg search" onClick={() => this.toSearch()}>
          <span className="iconfont icon-sousuo"></span>
        </div>
        <a href="#">
          <div className="control_bg top">
            <span className="iconfont icon-fanhuidingbu"></span>
          </div>
        </a>
      </div>
    </>)
  }

  // 是否登录
  getLoginInfo = async () => {
    if (!isAuth()) return this.setState({ isLogin: "", avatar: "" });
    const { data: { avatar } } = await API.post("/user/islogin", { token: getToken() });
    this.setState({
      avatar,
      isLogin: true
    });
  }

  // 搜索
  search() {
    const { searchBox, put, searchClose } = this.state;
    return (
      <div id="search_box" style={{ display: searchBox }}>
        <div className="search_main">
          <form action="" method="post">
            <input ref={c => this.searchVal = c} style={{ width: put }} type="text" placeholder="请输入需要搜索的文章..." />
            <span className="iconfont icon-sousuo" onClick={this.searchResult} />
          </form>
          {/* <img onClick={this.closeSearch} style={{ transform: searchClose }} className="search_close" src="fish.png" alt="关闭按钮" width="60" /> */}
          <span className="search_close iconfont2" onClick={this.closeSearch} style={{ transform: searchClose }}>&#xe6c9;</span>
        </div>
      </div>);
  }

  // 搜索结果
  searchResult = () => {
    if (this.searchVal.value === '') return;
    this.props.history.push(`/search/${this.searchVal.value}`);
    this.searchVal.value = '';
    this.closeSearch();
  }

  // 搜索
  toSearch() {
    this.setState({ searchBox: "flex" });
    setTimeout(() => this.setState({ put: "600px", searchClose: "scale(1) rotate(360deg)" }), 10);
  }

  // 关闭搜索
  closeSearch = () => {
    this.setState({ put: "0", searchClose: "scale(0.2) rotate(0)" });
    setTimeout(() => {
      this.setState({ searchBox: "none" });
    }, 510)
  }
}
export default withRouter(Control);