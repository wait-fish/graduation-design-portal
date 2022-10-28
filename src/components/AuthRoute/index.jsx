import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isAuth } from "../../util";

// 鉴权路由
export default class AuthRoute extends Component {

  render() {
    // 组件重命名 拿到剩余参数
    const { component: Component, ...rest } = this.props;
    // 解开剩余参数
    return <Route {...rest} 
    render= { props =>
    isAuth() ? <Component {...props} /> :
    <Redirect to={{
      pathname: "/login",
      state: { from: props.location }
    }} /> } 
    />
  }

}
