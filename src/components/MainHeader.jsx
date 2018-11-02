import React, { Component } from 'react';
import { Authenticator } from 'aws-amplify-react';

import {
  BDiv,
  BH2,
  ButtonToolbar,
  ButtonGroup,
  Button
} from 'bootstrap-4-react';

export default class MainHeader extends Component {
  render() {
    const { user } = this.props;

    if (user) {
      return (
        <BDiv
          display="flex"
          flex="wrap md-nowrap"
          justifyContent="between"
          alignItems="center"
          pt="3"
          pb="2"
          mb="3"
          border="bottom"
        >
          <BH2>Election Usage Times</BH2>
          <ButtonToolbar mb="2 md-0">
            <ButtonGroup mr="2">
              <Button outline secondary sm>Share</Button>
              <Button outline secondary sm>Export</Button>
            </ButtonGroup>
            <Button outline secondary sm dropdownToggle>
              <span data-feather="calendar"></span>
              This Month
          </Button>
          </ButtonToolbar>
        </BDiv>
      )
    } else {
      return (
        <Authenticator />
      )
    }
  }
}