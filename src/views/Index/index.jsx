import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../../components/Nav';
import Share from '../../components/Share';
import Plate from '../../components/Plate';
import Footer from '../../components/Footer'
import { BASE_URL, API } from "../../util";
import "./index.scss";

const navList = [
  {
    path: "/community",
    iconName: "icon-qunliao",
    title: "在线社区"
  },
  {
    path: "/past",
    iconName: "icon-liuyanban-05",
    title: "留言板"
  },
  {
    path: "/expand",
    iconName: "icon-ziyuanxhdpi",
    title: "拓展区"
  }
]

export default class Index extends Component {

  state = {
    clock: {
      hours: "rotate(270deg) translateY(-50%) scale(0.5)",
      minute: "rotate(270deg) translateY(-50%) scale(0.5)",
      second: "rotate(270deg) translateY(-50%) scale(0.5)",
    },
    skillList: []
  }

  timer = null;

  componentDidMount() {
    this.startClock();
    this.getSkillList();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  async getSkillList() {
    const { data } = await API.get("/articles", { params: {
      end: 0,
      start: 4
    }});
    this.setState({skillList: data});
  }

  render() {
    return (
      <>
        {/* 渲染导航栏 */}
        <Nav id="index_nav" />
        {/* 渲染头部 */}
        {this.header()}
        {/* 渲染内容 */}
        <main>
          <div className="container index_container">
            <div className="main_left">
              <Share title={"分享"} skillList={this.state.skillList} />
              <Link to="/shares">
                <div className="main_more">
                  查看更多文章<span className="iconfont icon-qianjin"></span>
                </div>
              </Link>
            </div>
            {/* 我的列表 */}
            {this.myList()}
          </div>
        </main>
        {/* 页脚 */}
        <Footer />
      </>
    )
  }

  // 头部
  header() {
    const { clock } = this.state;
    return (<>
      <div className="header" style={{ background: `url(${BASE_URL}/images/index-bg.jpg) no-repeat` }}>
        <h2 className="type">
          博客，属于自己的小世界。
        </h2>
        <div className="clock" style={{ backgroundImage: `url(${BASE_URL}/images/clock.png)` }}>
          <img style={{ transform: clock.hours }} className="hours" src={BASE_URL + "/images/hours.png"} alt="" />
          <img style={{ transform: clock.minute }} className="minute" src={BASE_URL + "/images/minute.png"} alt="" />
          <img style={{ transform: clock.second }} className="second" src={BASE_URL + "/images/second.png"} alt="" />
          <img className="dian" src={BASE_URL + "/images/dian.png"} alt="" />
        </div>
      </div>
      <div className="custom-shape-divider-top-1631255634">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
          preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25" className="shape-fill"></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5" className="shape-fill"></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="shape-fill"></path>
        </svg>
      </div>
    </>)
  }

  myList() {
    return (
      <div id="my">
        <div className="my_header">
          <img src={BASE_URL + "/images/fish.png"} alt="" />
          <h2>等鱼</h2>
          <p>哪怕你再不懂设计，用心的话总会有不错的创意。</p>
        </div>
        <Plate navList={navList} />
      </div>
    );
  }

  // 操作时钟
  startClock() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.setState({
        clock: {
          second: this.getTime('ss'),
          minute: this.getTime('mm'),
          hours: this.getTime('hh')
        }
      });
    }, 1000);
  }

  // 控制时钟逻辑
  /**
       * @param {elment} elm 操作的dom
       * @param {Date} time 时间对象
       * * @param {String} timeStyle 时间类型 hh , mm, ss
       * 分钟公式：m * 6°
       * 小时公式：h * 30° + m * 0.5
  */
  getTime(timeStyle) {
    let time = new Date();
    let m = time.getMinutes();
    return `rotate(${timeStyle === 'ss' ? time.getSeconds() * 6 : (timeStyle === 'mm' ? m * 6 : DateHours(time) * 30 + m * 0.5) - 90}deg) translateY(-50%) scale(0.5)`;

    function DateHours(time) {
      return time.getHours() > 12 ? time.getHours() - 12 : time.getHours();
    }
  }
}
