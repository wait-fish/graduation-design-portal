import React, { Component } from 'react';
import Nav from '../../components/Nav';
import Title from '../../components/Title';
import Footer from '../../components/Footer';
import style from './index.module.scss';
import { API, BASE_URL, getToken, removeToken } from '../../util';

export default class Oneself extends Component {
  
  state = {
    userinfo: {}
  }

  componentDidMount() {
    this.getUserInfo();
  }
  
  render() {
    const { userinfo } = this.state;
    return (<>
      <Nav/>
      <div className={"container container-bg " + style.mybg}>
        <Title>个人中心</Title>
        <div className={style.info_box}>
          <div className={style.info_left}>
            <img src={ BASE_URL + userinfo.avatar} alt="" />
          </div>
          <div className={style.info_right}>
            <h2>用户名：{userinfo.username}</h2>
            <p>账号：{userinfo.useraccount}</p>
          </div>
        </div>
        <button onClick={this.quit} className={style.quit_btn}>退出登录</button>
      </div>  
      <Footer />
    </>)
  }

  // 获取用户信息
  async getUserInfo() {
    const { data } = await API.post("/user/islogin", {
      token: getToken()
    });
    this.setState({ userinfo: data });
  }

  // 退出登录
  quit = () => {
    removeToken();
    this.props.history.replace("/");
  }
}
