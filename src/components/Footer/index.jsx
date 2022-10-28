import React, { Component } from 'react'
import "./index.scss";

export default class Footer extends Component {
  render() {
    return (<>
      <footer>
        <div className="container">
          <p>© 2021-2099 等鱼的博客</p>
          <p>哪怕你再不懂设计，用心的话总会有不错的创意。</p>
        </div>
      </footer>
    </>)
  }
}
