import React, { Component } from 'react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import Title from '../../components/Title';
import MyPicker from '../../components/MyPicker';
import { toast } from '../../components/Toast';
import { API, BASE_URL, getIDList, getToken, isAuth, isIDList, setIDList } from '../../util';
import style from './index.module.scss';

export default class ShareDetails extends Component {

  state = {
    article: {},
    nextArticle: {},
    preArticle: {},
    content: "", // 内容
    isGood: false,
    userInfo: {},
    reviewList: [],
    content2: "" // 回复内容
  }
  replyIndex = -1 // 点击回复时收集内容
  replyIndex2 = -1 // 互相回复时

  componentWillMount() {
    this.getArticle();
    this.getUserInfo();
  }

  render() {
    return (<>
      <Nav />
      <main>
        <div className="container" >
          {/* 渲染文章 */}
          {this.renderArticle()}
          <div className={style.reviewBox}>
            {/* 评论输入框 */}
            {this.renderReview()}
            {/* 评论区 */}
            {this.renderComment()}
          </div>
        </div>
      </main>
      <Footer />
    </>)
  }

  // 渲染评论区
  renderComment() {
    const { content2, reviewList } = this.state;
    return (<>
      <div className={style.comment}>
        {
          reviewList.length === 0 ?
            <div className={style.no_data}>
              还没有留言喔~
            </div> :
            reviewList.map((item, index) =>
              <div className={style.commentBox} key={item.id}>
                <div className={style.commentLeft}>
                  <img src={BASE_URL + item.avatar} alt="" />
                </div>
                <div className={style.commentRight}>
                  <div className={style.commentRightTop}>
                    <p>{item.username}</p>
                    <span>{item.time}</span>
                  </div>
                  <div className={style.commentRightTBottom}>
                    {item.content.text}
                  </div>
                  <div className={style.option}>
                    <span onClick={this.showComment(index)} className={style.click}>回复</span>
                  </div>
                  {/* 回复评论 */}
                  <ul>
                    {
                      item.content.children.length > 0 ?
                        item.content.children.map((item2, index2) =>
                          <li className={style.replyBox} key={index2}>
                            <div className={style.replyLeft}>
                              <img src={BASE_URL + item2.avatar} alt="" />
                            </div>
                            <div className={style.replyRight}>
                              <div className={style.replyContent}>
                                <div className={style.replyUser}>
                                  <h5>{item2.username}</h5>
                                  {
                                    item2.replyUsername === "" ? <h5>：</h5> :
                                      <div className={style.replyUserBox}>
                                        <span>回复</span>
                                        <h5>{item2.replyUsername}：</h5>
                                      </div>
                                  }
                                </div>
                                <p>{item2.text}</p>
                              </div>
                              <div className={style.replyOption}>
                                <span>{item2.time}</span>
                                <span onClick={this.showComment(index, index2)} className={style.click}>回复</span>
                              </div>
                            </div>
                          </li>
                        ) : ""
                    }
                  </ul>
                  <div className={style.replyInput} style={{
                    display: item.isShow ? "block" : "none"
                  }}>
                    <textarea className={style.review} name="" id="" placeholder="说点什么吧..." value={content2} onChange={this.handleText2()}></textarea>
                    <div className={style.options}>
                      <div>
                        {/* 渲染表情 */}
                        <MyPicker onClick={this.clickEmoji2()} style={{ position: "absolute", left: 0, top: "-355px" }} />
                      </div>
                      <div>
                        <button onClick={this.clickCancel} className={style.cancel}>取消</button>
                        <button onClick={this.sendReview2} className={style.reviewBtn}>发表评论</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
        }
      </div>
    </>);
  }

  // 渲染文章评论框
  renderReview() {
    const { content } = this.state;
    return (
      <div style={{ marginBottom: "50px" }}>
        <Title>文章评论</Title>
        <textarea className={style.review} name="" id="" placeholder="说点什么吧..." value={content} onChange={this.handleText()}></textarea>
        <div className={style.options}>
          <div>
            {/* 渲染表情 */}
            <MyPicker onClick={this.clickEmoji()} style={{ position: "absolute", left: 0, top: "30px" }} />
          </div>
          <button onClick={this.sendReview} className={style.reviewBtn}>发表评论</button>
        </div>
      </div>
    );
  }

  // 渲染文章
  renderArticle() {
    const { article, preArticle, nextArticle, isGood } = this.state;
    let time = new Date(article.createDate).toLocaleString();
    return (
      <div className={style.article}>
        <h1>{article.title}</h1>
        <p>作者：{article.author}&nbsp;•&nbsp;时间：{time}&nbsp;•&nbsp;{article.reviewCount}&nbsp;评论&nbsp;•&nbsp;{article.readCount}&nbsp;阅读</p>
        {/* 解析富文本 */}
        <div dangerouslySetInnerHTML={{__html:article.content}} className={style.content}></div>
        <div className={style.contentFooter}>
          <div className={[style.mybtn, preArticle.id === undefined ? style.noActive : ""].join(" ")} onClick={this.changeArticle(preArticle.id)}>
            <span>上一篇</span>
            <p>{preArticle.title}</p>
          </div>
          <div className={style.dianzan}>
            <span onClick={this.clickGood} className={"iconfont " + (isGood ? "icon-dianzan" : "icon-dianzan1")}></span>
            <p>{article.goodCount}</p>
          </div>
          <div className={[style.mybtn, nextArticle.id === undefined ? style.noActive : ""].join(" ")} onClick={this.changeArticle(nextArticle.id)}>
            <span>下一篇</span>
            <p>{nextArticle.title}</p>
          </div>
        </div>
      </div>
    )
  }

  // 是否显示评论框
  showComment(index, index2 = -1) {
    return () => {
      let { reviewList } = this.state;
      reviewList[index].isShow = true;
      this.setState({ reviewList: reviewList });
      this.replyIndex = index;
      this.replyIndex2 = index2;
    }
  }

  // 取消回复
  clickCancel = () => {
    const { reviewList } = this.state;
    reviewList[this.replyIndex].isShow = false;
    this.setState({ reviewList, content2: "" });
  }

  // 获取用户信息
  async getUserInfo() {
    const { data } = await API.post("/user/islogin", {
      token: getToken()
    });
    if (data.hasOwnProperty("text")) return this.props.history.push("/");
    this.setState({ userInfo: data });
  }

  // 回复评论
  /**{
   *  username: 自己的用户名
   *  avatar: 自己的用户头像
   *  replyUsername： 回复的用户名,
   *  time: 回复的时间
   *  content2: 回复的内容
   * }
   */
  sendReview2 = async () => {
    let { reviewList, content2, userInfo } = this.state;
    let review = reviewList[this.replyIndex];
    let replyUsername = this.replyIndex2 === -1 ? "" : review.content.children[this.replyIndex2].username;
    review.content.children.push({
      username: userInfo.username,
      avatar: userInfo.avatar,
      replyUsername,
      time: this.getDate(),
      text: content2
    });
    /**
     * token, 必填
     * children 子节点
     * id： 评论的id
     */
    const { data } = await API.post("/review/update", {
      token: getToken(),
      content: review.content,
      id: review.id
    });
    toast(data);
    if (data !== "回复成功") return;
    this.setState({ content2: "" });
    this.getReviewList();
  }

  // 发送评论
  sendReview = async () => {
    const { content, userInfo, article } = this.state;
    if (content === "") return toast("还是说点什么吧");
    const { data } = await API.post("/review/insert", {
      token: getToken(),
      article_id: article.id,
      article_title: article.title,
      username: userInfo.username,
      avatar: userInfo.avatar,
      time: this.getDate(),
      content: {
        text: content,
        children: []
      },
    });
    toast(data);
    if (data === "评论失败") return;
    this.setState({ content: "" });
    this.getReviewList();
  }

  // 获取评论
  async getReviewList() {
    const { article } = this.state;
    const { data } = await API.get("/review/reviewlist?article_id=" + article.id);
    // 添加回复框控制器
    // console.log(data);
    data.forEach((item, index) => data[index].isShow = false);
    this.setState({ reviewList: data });
  }

  // 阅读量变化
  async handelRead() {
    const { article } = this.state;
    const { data } = await API.get("/articles/handleread", {
      params: {
        article_id: article.id
      }
    });
    article.readCount = data.readCount;
    this.setState({ article });
  }

  // 点赞
  clickGood = async () => {
    if (!isAuth()) this.props.history.push("/login");
    const { article } = this.state;
    const { data } = await API.get("/user/handlegood", {
      params: {
        token: getToken(),
        article_id: article.id
      }
    });
    toast(data.text, 500);
    article.goodCount = data.goodCount;
    this.setState({ article });
    this.handleGood();
  }

  // 是否点赞
  async handleGood() {
    const { article } = this.state;
    const { data } = await API.get("/user/isgood", {
      params: {
        token: getToken(),
        article_id: article.id
      }
    });
    this.setState(data);
  }

  // 监听回复
  handleText2 = () => {
    return (e) => this.setState({ content2: e.target.value });
  }

  // 监听评论框
  handleText() {
    return (e) => this.setState({ content: e.target.value });
  }

  // 点击表情时
  clickEmoji2() {
    return (emoji) => {
      const { content2 } = this.state;
      this.setState({ content2: content2 + emoji.native });
    }
  }

  // 点击表情时
  clickEmoji() {
    return (emoji) => {
      const { content } = this.state;
      this.setState({ content: content + emoji.native });
    }
  }

  // 换文章
  // 点击标签时调用传入id，然后返回一个函数给react底层调用
  changeArticle = (id) => {
    if (id === undefined) return;
    return () => {
      this.getArticle(id);
    }
  }

  // 获取文章上下文
  async getArticleIDList() {
    if (!isIDList()) {
      const { data } = await API.get("/articles/idlist");
      setIDList(data);
    }
    /**
     * 判断当前文章的上下文
     * 如果上下文超出索引，说明到头或尾
     * 则修改为没有文章了
     */
    const { article } = this.state;
    const idList = getIDList();
    const noData = { title: "没有了" };
    let index = idList.findIndex(item => item.id === article.id);
    // 判断索引是否小于0
    let preArticle = index - 1 >= 0 ? idList[index - 1] : noData;
    let nextArticle = index + 1 >= idList.length ? noData : idList[index + 1];
    this.setState({ preArticle, nextArticle });
  }

  async getArticle(id = -1) {
    id = id === -1 ? this.props.match.params.id : id;
    let { data } = await API.get(`/articles?id=${id}`);
    window.history.replaceState("", "", `/share_details/${id}`);
    let article = data[0];
    this.setState({ article });
    // 需要等待 article 获取到之后才能进行下一步操作
    this.getArticleIDList();
    this.handleGood();
    this.handelRead();
    this.getReviewList();
  }

  //获取日期
  getDate() {
    let date = new Date();
    return `${date.getFullYear()}年${this.bu0(date.getMonth() + 1)}月${this.bu0(date.getDate())}日`
  }

  // 补0
  bu0(time) {
    return time > 9 ? time : '0' + time;
  }
}
