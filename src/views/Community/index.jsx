import React, { Component } from 'react';
import Socket from '../../util/socket';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import MyPicker from '../../components/MyPicker';
import { API, BASE_URL, getToken } from '../../util';
import style from './index.module.scss';

export default class Community extends Component {

  state = {
    // 1表示自己 2表示加入离开 3表示其他
    /**
     * userListObj: {
     *  type: '1',
     *  avatar: '',
     *  username: '',
     *  content: '',
     *  sendTime: '',
     *  key: ''
     * }
     */
    userList: [], // 聊天记录
    notClick: true,
    userInfo: {},
    totalUser: [] // 总用户数组
  }
  socket = null;

  componentDidMount() {
    this.getUserInfo();
    // 刷新页面时
    window.onbeforeunload =  () => {
      this.leaveGroup();
      this.props.history.replace("/");
    }
    window.addEventListener('keyup', this.sendEnter);
  }

  componentWillUnmount() {
    this.leaveGroup();
    window.removeEventListener('keyup', this.sendEnter);
  }

  componentDidUpdate(prevProps,prevState){
    if(prevState.userList.length !== this.state.userList.length)
      window.location.href = "#bottom"
  }

  render() {
    return (<>
      <Nav />
      <div className={style.communityBox}>
        {this.renderList()}
        {this.renderWindow()}
      </div>
      <Footer />
    </>)
  }

  // 渲染左边列表
  renderList() {
    const { userInfo, totalUser } = this.state;
    return (
      <div className={style.left}>
        {/* <h3 onClick={this.addGroup} >加入群聊</h3> */}
        <ul>
         {
           totalUser.length > 0 ? (
           totalUser.map(item =><li key={item.key} className={userInfo.username === item.username.slice(0, item.username.length - 4)? style.active : ''}>
            <img src={BASE_URL + item.avatar} alt="" />
            {/* 切除掉提示语 */}
            <p>{item.username.slice(0, item.username.length - 4)}</p>
          </li>)
           ) : ''
         }
        </ul>
      </div>
    )
  }

  // 渲染聊天窗口右边
  renderWindow() {
    const { notClick, totalUser } = this.state;
    return (
      <div className={style.right}>
        <div className={style.titleBox}>
          <span className={style.fh + " iconfont"}></span>
          <h2>博客群聊</h2>
          <p>在线人数&nbsp;{totalUser.length}</p>
        </div>
        {/* 聊天列表 */}
        {this.renderTextList()}
        <div className={style.inputBox}>
          <textarea
            className={style.input}
            onChange={this.changeInput}
            ref={c => this.textarea = c}
          ></textarea>
          <div className={style.options}>
            <MyPicker style={{
              position: "absolute",
              top: "-355px"
            }}
              onClick={this.selectPicker()}
            />
            <button
              onClick={this.send}
              disabled={notClick}
              className={style.button}
            >发送</button>
          </div>
        </div>
      </div>
    )
  }

  // 渲染聊天记录
  renderTextList() {
    const { userList } = this.state;
    return (
      <div className={style.showBox}>
        <ul ref='scroll_bottom'>
          {
            userList.length === 0 ? '' :
            userList.map(item => (
              item.type === '3' ? (
                <li className={style.showText} key={item.key}>
                <img className={style.show_left} src={BASE_URL + item.avatar} alt="" />
                <div className={style.show_right}>
                  <p className={style.show_text}>{item.content}</p>
                  <p className={style.show_time}><span>{item.sendTime}</span><span style={{ marginLeft: '10px' }}>{item.username}</span></p>
                </div>
              </li>
              ) :
              (item.type === '2' ? <li key={item.key} className={style.toast}>{item.username}</li> :
                (item.type === '1' ?  <li key={item.key} className={style.myText}>
                  <div className={style.my_left}>
                    <p className={style.my_text}>{item.content}</p>
                    <p className={style.my_time}><span style={{ marginRight: '10px' }}>{item.username}</span><span>{item.sendTime}</span></p>
                  </div>
                  <img className={style.my_right} src={BASE_URL + item.avatar} alt="" />
                </li> : '')
              )
            ))
              
          }
        </ul>
      </div>
    )
  }

  // 初始化Socket
  initSocket() {
    this.socket = Socket.initSocket();
    // 用户进入时触发，data 是用户数组
    this.socket.on('welcome', data => {      
      const { userList } = this.state;
      this.setState({ 
        userList: [...userList, data[data.length - 1]], // 拿到数组的最后一个
        totalUser: data
      });
    });
    // 接收到消息时触发，data 是用户发送信息
    this.socket.on('sendMsg', data => {   
      const { userList } = this.state;
      this.setState({ userList: [...userList, data] });
    });
    // 用户离开时触发，data 是用户数组
    this.socket.on('leave', (data, userInfo) => {     
      const { userList } = this.state;
      this.setState({ 
        userList: [...userList, userInfo[0]],
        totalUser: data
      });
    });
  }

  // 退出群聊
  leaveGroup = () => {
    const { userInfo } = this.state;
    this.socket.emit("leave", userInfo.username);
  }

  // 加入群聊
  addGroup = () => {
    const { userInfo } = this.state;
    let addToast = {
      username: userInfo.username + "加入群聊",
      avatar: userInfo.avatar,
      type: '2',
      key: new Date().getTime()
    }
    this.socket.emit("enter", addToast);
  }

  // 获取用户信息
  async getUserInfo() {
    const { data } = await API.post("/user/islogin", {
      token: getToken()
    });
    if (data.hasOwnProperty("text")) return this.props.history.push("/");
    this.setState({ userInfo: data });
    this.initSocket();
    this.addGroup();
  }

  // 发送信息
  send = () => {
    const { value } = this.textarea;
    if (!value) return;
    const { userInfo, userList } = this.state;
    let news = {
      avatar: userInfo.avatar,
      username: userInfo.username,
      content: value,
      type: '3',
      sendTime: this.createTime(),
      key: new Date().getTime()
    }
    this.socket.emit('message', news); //发送消息
    news.type = '1';
    this.setState({
      userList: [...userList, news]
    });
    this.textarea.value = '';
    this.setState({ notClick: true });
    // this.bottomUl.scrollTop = this.bottomUl.scrollHeight;
    setTimeout(() => {
      this.refs.scroll_bottom.scrollTop = this.refs.scroll_bottom.scrollHeight
    }, 0);
  }

  sendEnter = ({ key }) => {
    if (key === 'Enter') this.send();
  }

  // 选择表情
  selectPicker() {
    return (e) => {
      this.setState({ notClick: false });
      const { value } = this.textarea;
      this.textarea.value = value + e.native;
    }
  }

  // 输入内容时
  changeInput = (e) => {
    const { value } = e.target;
    if (value.trim() === "") return this.setState({ notClick: true });
    this.setState({ notClick: false });
  }

  // 创建时间函数
  createTime() {
    let date = new Date();
    return this.bu0(date.getHours()) + ':' + this.bu0(date.getMinutes());
  }

  bu0(time) {
    return time < 10 ? '0' + time : time;
  }
}
