import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../util';
import "./index.scss";

export default class Share extends Component {
  render() {
    return (<>
      <div className="skill">
        <h2 className="skill_title">{this.props.title}</h2>
        <div className="skill_main">
          {this.renderSkillList()}
        </div>
      </div>
    </>)
  }

  renderSkillList() {
    const { skillList } = this.props;
    return skillList ? skillList.map(item => (
      <div className="content" key={item.id}>
        <h3 className="content_title">{item.title}</h3>
        <div className="content_box">
          <div className="box_left">
            <img src={BASE_URL + item.imgSrc} alt="" />
          </div>
          <div className="box_right">
            <p className="box_right_content">{item.content}</p>
            <div className="box_right_bottom">
              <div className="author">{item.author}</div>
              <div className="time">时间：{item.createDate.slice(0,10)}</div>
              <div className="review">
                <span className="iconfont icon-pinglun"></span>
                {item.reviewCount}
                </div>
              <div className="reading">
                <span className="iconfont icon-chakan"></span>
                {item.readCount}
                </div>
              <div className="good">
                <span className="iconfont icon-dianzan1"></span>
                {item.goodCount}
                </div>
              <Link to={ "/share_details/" + item.id } className="read">阅读文章</Link>
            </div>
          </div>
        </div>
      </div>
    )) : <div id="no_data">
      <img src={BASE_URL + "/images/no_data.png"} alt="" />
      <h2>没有数据了，你看着办吧。</h2>
    </div>
  }
}
