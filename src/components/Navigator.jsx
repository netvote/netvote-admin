import React, { Component } from 'react';
import { Navbar, Nav, BSpan } from 'bootstrap-4-react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Auth, Hub, Logger } from 'aws-amplify';
import { JSignOut, JSignIn } from './auth';

const HomeItems = props => (
  <React.Fragment>
    {/* <Nav.ItemLink href="#/" active>
      Home
      <BSpan srOnly>(current}</BSpan>
    </Nav.ItemLink> */}
    {/* <Nav.ItemLink href="#/login">
      Login
    </Nav.ItemLink> */}
  </React.Fragment>
)

const LoginItems = props => (
  <React.Fragment>
    {/* <Nav.ItemLink href="#/">
      Home
    </Nav.ItemLink> */}
    {/* <Nav.ItemLink href="#/login" active>
      Login
      <BSpan srOnly>(current}</BSpan>
    </Nav.ItemLink> */}
  </React.Fragment>
)

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
      .then(data =>  {
        console.log(data);
       
        let token = data.getIdToken().getJwtToken();
        
        console.log('JwtToken: ' + token);

        // fetch('https://elections.netvote.io/v1/usage/detail', {
        //   method: 'get',
        //   headers: new Headers({
        //     'Authorization': `Bearer ${token}`
        //   })
        // }).then(response =>  {
        //   console.log(response.json());
        // });


      }).catch(err => console.log(err));
   
  }
  ""
  render() {
    const { user } = this.state;

    return (
      <Navbar expand="md" dark bg="dark" fixed="top">
        <Navbar.Brand href="#">Netvote Admin</Navbar.Brand>
        <Navbar.Toggler target="#navbarsDefault" />

        <Navbar.Collapse id="navbarsDefault">
          <Navbar.Nav mr="auto">
            <HashRouter>
              <Switch>
                <Route exact path="/" component={LoginItems} />
                {/* <Route exact path="/login" component={LoginItems} /> */}
              </Switch>
            </HashRouter>
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