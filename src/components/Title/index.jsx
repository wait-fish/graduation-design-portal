import React, { Component } from 'react';
import style from './index.module.scss';

export default class Title extends Component {
  render() {
    return (<>
      <h2 className={style.title}>{this.props.children}</h2>
    </>)
  }
}
