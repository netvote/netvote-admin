import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Form } from 'bootstrap-4-react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Auth, Hub, Logger } from 'aws-amplify';
import { JSignOut, JSignIn } from './auth';
import { NetVoteAdmin } from '../lib';

const logger = new Logger('Navigator');

export default class Navigator extends Component {

  constructor(props) {
    super(props);

    this.loadUser = this.loadUser.bind(this);

    Hub.listen('auth', this, 'navigator'); // Add this component as a listener of auth events.

    this.state = { user: null }
  }

  componentDidMount() {
    this.loadUser(); // The first check
  }

  onHubCapsule(capsule) {
    logger.info('on Auth event', capsule);
    this.loadUser(); // Triggered every time user sign in / out.
  }

  loadUser() {
    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user: user }))
      .catch(err => this.setState({ user: null }));

    Auth.currentSession()
      .then(async data => {

        //TODO: FIND PROPER COMPONENT LOCATION --- TESTING ONLY!!!!
        let netVoteAdmin = new NetVoteAdmin();

        let usageDetails = await netVoteAdmin.getElectionUsageDetails();
        console.log('NetVoteAdmin Response: ' + JSON.stringify(usageDetails));

        let keys = await netVoteAdmin.getApiKeys();
        console.log(keys);

        for (let i = 0; i < keys.keyList.length; i++) {
          let key = await netVoteAdmin.getApiKey(keys.keyList[i].id)
          console.log(key);
        }

      }).catch(err => console.log(err));
  }

  render() {

    const { user } = this.state;

    return (
      <Navbar expand="md" dark bg="dark" fixed="top">
        <Navbar.Brand href="#">Netvote Admin</Navbar.Brand>
        <Navbar.Toggler target="#navbarsDefault" />

        <Navbar.Collapse id="navbarsDefault" >
          <Navbar.Nav mr="auto">
          </Navbar.Nav>
          <Navbar.Text mr="2">
            {user ? 'Logged in as ' + user.username : 'Please sign in'}
          </Navbar.Text>
          {user && <JSignOut />}
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
