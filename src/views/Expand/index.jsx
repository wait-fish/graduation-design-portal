import React, { Component } from 'react';
import Nav from '../../components/Nav';
import Plate from '../../components/Plate';
import Footer from '../../components/Footer';
import { API, getToken } from '../../util';

export default class Expand extends Component {

  state = {
    navList: []
  }

  componentDidMount() {
    this.isLogin();
    this.getList();
  }

  render() {
    const { navList } = this.state;
    return (<>
      <Nav />
      <div className="container" style={{ 
        marginBottom: "50px", 
        minHeight: "400px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around"
        }}>
        <Plate style={{
          width: "30%"
        }} navList={navList} />
      </div>
      <Footer />
    </>)
  }

  async isLogin() {
    const { data } = await API.post("/user/islogin", {
      token: getToken()
    });
    if (data.hasOwnProperty("text")) this.props.history.push("/");
  }

  async getList() {
    const { data } = await API.get("/expand/expandlist");
    if (data.length % 3 !== 0) {
      let size = data.length % 3;
      for(let i = 0 ; i < 3 - size; i++) 
        data.push({ title: "", path: new Date().getTime() + i })
    }
    this.setState({ navList: data });
  }
}
