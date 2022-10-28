import React, { Component } from 'react';
import { toast } from '../../components/Toast';
import TestToast from '../../components/TestToast';
import { BASE_URL, API, setToken, isAuth, removeToken } from '../../util';
import "./index.scss";

const USERNAME = "必须是8位内的数字or字母or中文or_";// 用户名
const USERACCOUNT = "必须是8-16位数字or字母组成"; // 账号
const PASSWORD = "必须是8-16位数字or字母组成or."; // 密码


//用户名正则，1到8位（字母，数字，下划线，减号）[\u4E00-\uFA29]|[\uE7C7-\uE7F3]汉字编码范围
const usernameRegExp = /^[a-zA-Z0-9_\u4E00-\uFA29\uE7C7-\uE7F3]{1,8}$/;
const useraccountRegExp = /^[a-zA-Z0-9]{8,16}$/;
const passwordRegExp = /^[a-zA-Z0-9.]{8,16}$/;
export default class Login extends Component {
  state = {
    filePhoto: "",
    // 密码注册检查
    pwdRegisterForm: {
      text: "",
      color: ""
    },
    // 账号注册检查
    uaccountRegisterForm: {
      text: "",
      color: ""
    },
    // 用户名注册检查
    unameRegisterForm: {
      text: "",
      color: ""
    },
    // 账号登录检查
    uaccountLoginForm: {
      text:"",
      color: ""
    },
    // 密码登录检查
    pwdLoginForm: {
      text:"",
      color: ""
    },
  }
  uploadDefaultPhoto = BASE_URL + "/images/fish.png";
  componentDidMount() {
    window.addEventListener('keyup', this.sendEnter);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.sendEnter);
  }
  render() {
    const { filePhoto, uaccountRegisterForm, unameRegisterForm, pwdRegisterForm, pwdLoginForm, uaccountLoginForm } = this.state;
    return (
      <div id="login">
        <div className="dowebok" ref={c => this.dowebok = c}>
          <div className="form sign-in">
            {/* 登录 */}
            <form 
            ref={c=>this.loginForm = c}
            method="post"
            encType="multipart/form-data"
            onSubmit={this.handleLogin}>
              <h2>欢迎回来</h2>
              <label>
                <span>账号</span>
                <TestToast color={uaccountLoginForm.color}>{uaccountLoginForm.text}</TestToast>
                <input type="useraccount" />
              </label>
              <label>
                <span>密码</span>
                <TestToast color={pwdLoginForm.color}>{pwdLoginForm.text}</TestToast>
                <input type="password" />
              </label>
              <p className="forgot-pass"></p>
              <button type="submit" className="submit">登 录</button>
              <button onClick={() => this.props.history.push("/")} type="button" className="fb-btn">返回首页</button>
            </form>
          </div>
          {/* 切换div */}
          <div className="sub-cont">
            <div className="img">
              <div className="img__text m--up">
                <h2>还未注册？</h2>
                <p>立即注册，发现大量机会！</p>
              </div>
              <div className="img__text m--in">
                <h2>已有帐号？</h2>
                <p>有帐号就登录吧，好久不见了！</p>
              </div>
              {/* js原生函数 toggle 类名存在就删除，否则就添加 */}
              <div onClick={() => this.dowebok.classList.toggle('s--signup')} className="img__btn">
                <span className="m--up">注 册</span>
                <span className="m--in">登 录</span>
              </div>
            </div>
            <div className="form sign-up">
              {/* 注册 */}
              <form
              method="post" 
              encType="multipart/form-data"
              onSubmit={this.handleRegister}>
                <h2>立即注册</h2>
                <label>
                  <div className="show_avatar">              
                    <img 
                    style={{width: "50px", height: "50px", borderRadius: "50%"}} 
                    src={ filePhoto || this.uploadDefaultPhoto } alt="" />
                  </div>
                  <div id="file_put" >
                    <button className="file-btn" type="button">上传头像
                    </button>
                    <input 
                      onChange={this.handleAvatar()}
                      type="file" 
                      name="avatar"
                      accept=".jpg, .jpeg, .png"
                      size="2048" 
                      />
                  </div>
                </label>
                <label>
                  <span>用户名</span>
                  <TestToast color={unameRegisterForm.color}>{unameRegisterForm.text}</TestToast>
                  <input onBlur={this.userIsExists} type="text" name="username" />
                </label>
                <label>
                  <span>账号</span>
                  <TestToast color={uaccountRegisterForm.color}>{uaccountRegisterForm.text}</TestToast>
                  <input onBlur={this.accountIsExists} type="text" name="useraccount" />
                </label>
                <label>
                  <span>密码</span>
                  <TestToast color={pwdRegisterForm.color}>{pwdRegisterForm.text}</TestToast>
                  <input onBlur={this.pwdIsExists} type="password" name="password" />
                </label>
                <button type="submit" className="submit">注 册</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 登录
  handleLogin = async e => {
    if (e.preventDefault) e.preventDefault();
    let { elements } = e.target || e;
    let useraccount = elements[0].value;
    let password = elements[1].value;

    // 二次验证,如果其中有一个验证不通过则不发送请求
    if (this.warning(password, "pwdLoginForm", passwordRegExp, "错误") || 
    this.warning(useraccount, "uaccountLoginForm", useraccountRegExp, "错误")) return;
    // 验证通过就不用提示错误
    this.setWarning("pwdLoginForm");
    this.setWarning("uaccountLoginForm");

    const { data } = await API.post("/user/login", { useraccount, password });
    // 提示成功或者失败
    toast(data.text, 1000);
    if (data.text !== "登录成功") return;

    // 登录成功 存入数据
    if (isAuth()) removeToken();
    setToken(data.token);
    setTimeout( () => {
      const { state } = this.props.history.location;
      if (state !== undefined) return this.props.history.replace(state.from.pathname);
      this.props.history.replace("/");
    }, 1000);
  }

  // 回车登录
  sendEnter = ({ key }) => {
      if (key === 'Enter') this.handleLogin(this.loginForm);
  }
  

  // 文件头像变化时
  handleAvatar() {
    return e => {
      let file = e.target.files[0];
      if (!file) return this.setState({ filePhoto: this.uploadDefaultPhoto });
      // 大小
      if (file.size > 1024 * 1024 * 2) {
        e.target.value ="";
        this.setState({ filePhoto: this.uploadDefaultPhoto });
        return toast("图片不能大于2m", 2000);
      }
      // 将对象变成图片展示
      let filePhoto = window.URL.createObjectURL(file);
      this.setState({ filePhoto });
    }
  }

  // 注册表单验证
  handleRegister = async e => {
    e.preventDefault();
    let { elements } = e.target;
    let avatar = elements[1];
    let username = elements[2].value;
    let useraccount = elements[3].value;
    let password = elements[4].value;
    // 二次验证,如果其中有一个验证不通过则不发送请求
    if (this.warning(password, "pwdRegisterForm", passwordRegExp, PASSWORD) || 
    this.warning(useraccount, "uaccountRegisterForm", useraccountRegExp, USERACCOUNT) ||
    this.warning(username, "unameRegisterForm", usernameRegExp, USERNAME) ) return;
    // 如果通过了表示没有错误
    this.setWarning("pwdRegisterForm");
    this.setWarning("uaccountRegisterForm");
    this.setWarning("unameRegisterForm");

    // 新建表单对象
    var fd = new FormData()
    // 如果有拿到第一个文件
    if (avatar) fd.append('avatar', avatar.files[0]);
    fd.append('username', username);
    fd.append('useraccount', useraccount);
    fd.append('password', password);
    let config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    // 注册
    const data = await API.post("/user/register", fd, config);

    // 提示成功或者失败
    toast(data.data, 2000);
    if (data.status !== 200) return;
    elements[1].value = "";
    elements[2].value = "";
    elements[3].value = "";
    elements[4].value = "";
    this.setState({ filePhoto: "" });
    this.dowebok.classList.toggle('s--signup');
  }

  // 用户名查重
  userIsExists = async (e) => {
    // 去空，格式检查
    let isNot = this.warning(e.target.value, "unameRegisterForm", usernameRegExp, USERNAME);
    // 如果验证不通过
    if (isNot) return;
    let { data } = await API.get("/user/frontinfo?username=" + e.target.value);
    if (data.length !== 0) return this.setWarning("unameRegisterForm", "已经存在");
    else this.setWarning("unameRegisterForm", "可以使用", "green");
  }

  // 账号查重
  accountIsExists = async (e) => {
    // 输入的账号，账号提示对象，账号正则表达式常量，账号提示常量
    let isNot = this.warning(e.target.value, "uaccountRegisterForm", useraccountRegExp, USERACCOUNT);
    // 如果为空或者格式错误
    if (isNot) return;
    let { data } = await API.get("/user/frontinfo?useraccount=" + e.target.value);
    if (data.length !== 0) this.setWarning("uaccountRegisterForm", "已经被注册");
    else this.setWarning("uaccountRegisterForm", "可以使用", "green");
  }

  //  密码校验
  pwdIsExists = (e) => {
    let isNot =  this.warning(e.target.value, "pwdRegisterForm", passwordRegExp, PASSWORD);
    if (isNot) return;
    this.setWarning("pwdRegisterForm", "可以使用", "green");
  }

  /**
   * 警告提示
   * @param {string} value 输入的值
   * @param {string} objname 提示对象名
   * @param {RegExp} RegExp  正则校验规则
   * @param {string} rule 提示规则
   * @returns true 表示不通过，false表示通过
   */
  warning(value, objname, RegExp, rule) {
    // 如果等于空
    if ( value === null || value === undefined || value === "" || value.trim().length === 0) return !this.setWarning(objname, "不能为空");
    this.setWarning();
    // 如果格式正确
    if (RegExp.test(value)) return false;
    return !this.setWarning(objname, rule);
  }

  /**
   * 写入警告提示内容
   * @param {object} Form 警告对象 必填
   * @param {string} text 提示文字 / 默认 ""
   * @param {string} color 提示颜色 / 默认 red
   */
  setWarning(objname, text = "", color = "") {
    let objInobj = {};
    objInobj[objname] = { text, color };
    this.setState(objInobj);
  }

}