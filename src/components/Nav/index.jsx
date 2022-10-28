import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { BASE_URL } from '../../util'
import './index.scss';

const navName = [
  {
    name: "首页",
    path: '/'
  },
  {
    name: "分享",
    path: '/shares'
  },
  {
    name: "在线社区",
    path: '/community'
  },
  {
    name: "留言板",
    path: '/past'
  },
  {
    name: "拓展区",
    path: '/expand'
  },
];
class Nav extends Component {
  state = {
    pathName: "/"
  };

  componentDidMount() {
    // 导航栏变化时获取路径
    this.setState({ pathName: this.props.location.pathname});
  }
  
  render() {
    const { location, id } = this.props;
    return (<>
      <nav id={id}>
        <div className="container">
          <img src={BASE_URL + "/images/logo.png"} alt="" />
          <ul>
            {navName.map(item => <li className={location.pathname === item.path ? "active" : ""} key={item.name}>
              <Link to={item.path}>{item.name}</Link>
              </li>)}
          </ul>
        </div>
      </nav>
    </>)
  }
}

export default withRouter(Nav)