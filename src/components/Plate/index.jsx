import React, { Component } from 'react';
import { BASE_URL } from '../../util';
import "./index.scss";

/**
 * 需要参数：
 * 1.数组[]：navList
 * 2.项对象{}：object
 *  3.项属性: 
 *    {
 *      path: "/**", 路径
 *      iconName: "icon-**", 字体图标  二选一
 *      imgSrc: "/images/*.png", 图标图片 二选一
 *      title: "name" 板块名
 *    }
 */

export default class Plate extends Component {

  render() {
    const { navList, ...rest } = this.props;
    return (<>
      {
      navList.length > 0 ?
      navList.map(obj => obj.title !== ""? 
      <a key={obj.path} href={obj.path} className="plate" {...rest}>
        {/* 是否有字体图标 ？ 渲染字体图标 ： 渲染图片 */}
        {obj.iconName ? <span className={ "iconfont " + obj.iconName }></span> : <img src={ BASE_URL + obj.imgSrc } alt="" /> }
        <p>{obj.title}</p>
      </a> :
      <div key={obj.path} {...rest}></div>
      ) :
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
        color: "#ccc",
        fontSize: "40px"
      }}>
        没有数据~
      </div>
      }
    </>)
  }
}
