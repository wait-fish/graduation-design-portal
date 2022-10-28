import React, { Component } from 'react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import Share from '../../components/Share';
import Pagination from 'rc-pagination';
import { API } from '../../util';
import "./index.scss";

export default class Shares extends Component {

  state = { 
    skillList: [], // 显示的条目
    total: 0,
    pageSize: 3, // 页面大小和结束索引得相同
    start: 0, // 开始索引
    end: 3, // 结束索引
    current: 1
  };
  // 所有数据条目
  data = [];
  componentDidMount() {
    // 获取所有数据
    this.getSkillList();
  }
  
  async getSkillList() {
    let { data } = await API.get('/articles');
    let { start, end } = this.state;
    this.setState({ 
      skillList: data.slice(start, end),
      total: data.length,
    });
    this.data = data;
  }

  render() {
    let { skillList, total, pageSize, current } = this.state;
    return (<>
        <Nav/>
        <div className="container skill_container">
          <Share title={"分享"} skillList={skillList} />
        </div>
        <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={index => this.changePage(this, index) }
        prevIcon="‹"
        nextIcon="›"
        />
        <Footer/>
    </>)
  }

  /**
   * 
   * @param {object} t 是 this 用来操作 state
   * @param {number} index 是当前页，用来计算页面显示的条目
   */
  // 页面变化时 t 是this，用来操作state ，
  changePage(t, index) {
    let { pageSize } = t.state;
    //（当前页面 - 1） * 页面大小
    let newStart = (index - 1) * pageSize;
    // 当前页面 * 页面大小 
    let newEnd = index * pageSize;
    t.setState({ 
      skillList: t.data.slice(newStart, newEnd),
      start: newStart,
      end: newEnd,
      current: index
    });
  }
}
