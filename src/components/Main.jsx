import React, { Component } from 'react';
import { Col, Row } from 'bootstrap-4-react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Auth, Hub, Logger } from 'aws-amplify';
import { Authenticator } from 'aws-amplify-react';

import MainHeader from './MainHeader';
import MainChart from './MainChart';
import MainTable from './MainTable';
import Sidebar from './Sidebar';

const logger = new Logger('Main');

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.loadUser = this.loadUser.bind(this);

    Hub.listen('auth', this, 'main');

    this.state = { user: null }
  }

  componentDidMount() {
    this.loadUser();
  }

  onHubCapsule(capsule) {
    logger.info('on Auth event', capsule);
    this.loadUser();
  }

  loadUser() {
    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user: user }))
      .catch(err => this.setState({ user: null }));
  }


  render() {
    const { user } = this.state;

    if (user) {
      logger.info('Main - Logging out - User!');
      return (
        <div>
          <Row>
            <Sidebar />
            <Col as="main" role="main" col="md-9 lg-10" ml="sm-auto" px="4">
              <MainHeader user={user} />
              <MainChart user={user} />
              <MainTable user={user} />
            </Col>
          </Row>
        </div>
      )
    } else {
      logger.info('Main - Logging out - No User!');
      return (
        <Col as="main" role="main" col="md-9 lg-10" ml="sm-auto" px="4">
          <Authenticator />
        </Col>
      )
    }
  }
}




