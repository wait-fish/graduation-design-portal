import { Component } from 'react';
import PropTypes from 'prop-types';

// toast 弹框组件
class Toast extends Component {
  static defaultProps = {
    msg: '操作成功', // 默认提示语
    time: 2000, // 默认弹框出现到消失的时间
  }

  static propTypes = {
    msg: PropTypes.string,
    time: PropTypes.number,
  }
  num = 1;

  showToast = (msg, duration) => {
    duration = isNaN(duration) ? 2000 : duration;
    var m = document.createElement('div');
    Toast.M = m;
    this.M = m;
    m.innerHTML = msg;
    m.style.cssText = " padding: 5px; width: auto; min-width: 180px; background: #000; opacity: 0.6; height: auto; min-height: 30px; color: #fff; line-height: 30px; text-align: center; border-radius: 4px; position: fixed; top: 10%; left: 50%; transform: translateX(-50%); z-index: 9999;"
    document.body.appendChild(m);
    setTimeout(function () {
      var d = 0.5;
      m.style.webkitTransition = 'opacity ' + d + 's ease-in';
      m.style.opacity = '0';
      setTimeout(function () {
        document.body.removeChild(m)
      }, d * 1000);
    }, duration);
  }

  render() {
    return [];
  }
}
export const toast = (msg = "操作成功", time = 2000) => {
  new Toast().showToast(msg, time);
};