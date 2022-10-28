import React, { Component } from 'react';
import { BASE_URL } from '../../util';

export default class Loading extends Component {
  render() {
    return (
      <div style={{ 
        width: "100%",
        height: "100vh",
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
      }}>
        <img src={BASE_URL + "/images/loading.gif"} alt="加载中..." />
      </div>
    )
  }
}
