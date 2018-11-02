import React, { Component } from 'react';
import { Lead, BSpan } from 'bootstrap-4-react';

export default class Usage extends Component {
  render() {
    const { user } = this.props;

    return (
      <React.Fragment>
        <h1>Coming Soon!</h1>
        { user && <Lead>USAGE PAGE You are signed in as  <BSpan font="italic">{user.username}</BSpan>.</Lead> }
      </React.Fragment>
    )
  }
}