import React, { Component } from 'react';
import Nav from '../../components/Nav';
import Title from '../../components/Title';
import Footer from '../../components/Footer';
import MyPicker from '../../components/MyPicker';
import { toast } from '../../components/Toast';
import style from './index.module.scss';
import { API, BASE_URL, getToken } from '../../util';

export default class Past extends Component {

  state = {
    content: "",
    userinfo: {},
    pastList: []
  }

  componentDidMount() {
    this.isLogin();
    this.getUserInfo();
  }

  render() {
    return (<>
      <Nav />
      <div className={"container container-bg " + style.mybg}>
        {/* 评论输入框 */}
        {this.renderCommentInput()}
        {/* 评论 */}
        {this.renderPasts()}
      </div>
      <Footer />
    </>)
  }

  // 渲染留言
  renderPasts() {
    const { pastList } = this.state;
    return (
      <div className={style.past_box}>
        {
          pastList.length > 0 ?
            pastList.map(item =>
              <div className={style.year_box} key={item.year}>
                <h2 className={style.year_title}>{item.year}</h2>
                <ul>
                  {
                    item.children.map(cd =>
                      <li key={cd.username + cd.time + cd.content}>
                        <span className={style.time}>{cd.time}</span>
                        <p>
                          <img style={{
                            width: "20px",
                            borderRadius: "50%"
                          }} src={BASE_URL + cd.avatar} alt="" />
                          <span className={style.avatar}>{cd.username}：</span>
                          {cd.content}</p>
                      </li>
                    )
                  }
                </ul>
              </div>
            ) :
            <div className={style.no_data}>
              还没有留言喔~
            </div>
        }
      </div>
    )
  }

  // 渲染评论输入框
  renderCommentInput() {
    const { content } = this.state;
    return (<>
      <Title>留言板</Title>
      <textarea className={style.review} placeholder="说点什么吧..." value={content} onChange={this.handleText}></textarea>
      <div className={style.options}>
        <div>
          {/* 渲染表情 */}
          <MyPicker onClick={this.clickEmoji()} style={{ position: "absolute", left: 0, top: "30px", zIndex: "3" }} />
        </div>
        <button onClick={this.addPast} className={style.reviewBtn}>发表留言</button>
      </div>
    </>)
  }

  async isLogin() {
    const { data } = await API.post("/user/islogin", {
      token: getToken()
    });
    if (data.hasOwnProperty("text")) this.props.history.push("/");
  }

  // 添加留言
  addPast = async () => {
    const { content, userinfo } = this.state;
    if (content === "") return toast("还是说点什么吧", 1000);
    let date = new Date();
    let time = this.bu0(date.getMonth() + 1) + '-' +  this.bu0(date.getDate());
    let { data } = await API.post("/past/add", {
      token: getToken(),
      year: date.getFullYear(),
      time,
      content,
      username: userinfo.username,
      avatar: userinfo.avatar
    });
    this.setState({ content: ""});
    toast(data);
    if (data !== "留言成功") return;
    this.getPastList();
  }

  // 获取用户信息
  async getUserInfo() {
    let { data } = await API.post("/user/islogin", {
      token: getToken()
    });
    this.setState({ userinfo: data });
    this.getPastList();
  }

  // 获取留言列表
  async getPastList() {
    let { data } = await API.get("/past/list?token=" + getToken());
    if (!Array.isArray(data)) return this.props.history.push("/login");
    this.setState({ pastList: data });
  }

  // 选中表情时
  clickEmoji() {
    return (emoji) => {
      const { content } = this.state;
      this.setState({ content: content + emoji.native });
    }
  }

  // 输入文本
  handleText = (e) => {
    this.setState({ content: e.target.value });
  }

  // 
  bu0(time) {
    return time < 10 ? '0' + time : time;
  }
}
