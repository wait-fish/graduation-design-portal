import React, { Component } from 'react'

export default class TestToast extends Component {
  render() {
    return (<>
        <span style={{color: this.props.color || "red"}}>{this.props.children}</span>
    </>)
  }
}
