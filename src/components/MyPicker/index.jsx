import React, { Component } from 'react';
// 导入表情
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import PropTypes from 'prop-types';
import "./index.scss";

export default class MyPicker extends Component {

  static propTypes = {
    style: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
  }

  state = {
    isShowPicker: false,
    transition: false
  }

  render() {
    const { isShowPicker, transition } = this.state;
    return (<div id="myPicker">
      <div>
        <span onClick={this.showPicker} className="iconfont icon-biaoqing"></span>
      </div>
      <Picker
        {...this.props}
        style={Object.assign(this.props.style, {
          transition: "0.5s",
          display: isShowPicker ? "block" : "none",
          opacity: transition ? "1" : "0"
        }) }
        onSelect={() => this.setState({ isShowPicker: false, transition: false})}
        color="#333"
        perLine={9}
        set="apple"
        title="等鱼のemoji"
        showSkinTones={false}
        i18n={{
          search: '搜索...',
          clear: 'Clear',
          categories: {
            search: '搜索结果',
            recent: '经常使用',
            smileys: '笑脸 & 情感',
            people: '心情 & 肢体',
            nature: '动物 & 自然',
            foods: '食物 & 饮料',
            activity: '活动',
            places: '旅行 & 地点',
            objects: '对象',
            symbols: '符号',
            flags: '标志',
          },
          categorieslabel: '表情符号类别',
        }}
      />
    </div>
    )
  }

  // 是否显示表情面板
  showPicker = () => {
    const { isShowPicker, transition } = this.state;
    // 隐藏
    if (isShowPicker) {
      this.setState({ transition: !transition });
      setTimeout(() => {
        this.setState({ isShowPicker: !isShowPicker });
      }, 500);
    } else {
      this.setState({ isShowPicker: !isShowPicker });
      setTimeout(() => {
        this.setState({ transition: !transition });
      }, 10);
    }
  }
}
