import React, { Component } from 'react';
import Nav from '../../components/Nav';
import Share from '../../components/Share';
import Footer from '../../components/Footer';
import { API } from '../../util';

export default class Search extends Component {

  state = {
    keyword: "",
    resultList: []
  }

  componentDidMount() {
    this.searchRes();
  }

  componentWillReceiveProps(nextProps) { 
    // 关键词变化时重新查询
    if (nextProps.match.params.query !== this.props.match.params.query) {
      this.searchRes(nextProps);
    }
  }

  render() {
    const { resultList, keyword } = this.state;
    return (<>
      <Nav/>
      <div className="container container-bg" style={{ marginBottom: "50px" }}>
        <Share title={keyword} skillList={resultList} />
      </div>
      <Footer/>
    </>)
  }

  //
  async searchRes(nextProps = null) {
    const { query } = nextProps === null ? this.props.match.params : nextProps.match.params ;
    const { data } = await API.get("/articles/search?keyword=" + query);
    this.setState({ resultList: data, keyword: query});
  }
}
