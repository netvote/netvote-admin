import * as React from 'react';
import { Input, Button, Card, CardFooter, CardGroup, CardBody, Col, Container, Form, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

import Auth from '@aws-amplify/auth'
import { AuthPiece } from 'aws-amplify-react'

import { I18n, JS, ConsoleLogger as Logger } from '@aws-amplify/core';

import logo from '../../../assets/img/brand/cd-logo.png'

const logger = new Logger('SignIn');

export default class SignIn extends AuthPiece {
  constructor(props) {
    super(props);

    this.checkContact = this.checkContact.bind(this);
    this.signIn = this.signIn.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);



    this._validAuthStates = ['signIn', 'signedOut', 'signedUp'];
    this.state = {
      width: window.innerWidth,
    };
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  onKeyDown(e) {
    if (e.keyCode !== 13) return;

    const { hide = [] } = this.props;
    if (this.props.authState === 'signIn' && !hide.includes(SignIn)) {
      this.signIn();
    }
  }

  checkContact(user) {
    if (!Auth || typeof Auth.verifiedContact !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
    }
    Auth.verifiedContact(user)
      .then(data => {
        if (!JS.isEmpty(data.verified)) {
          this.changeState('signedIn', user);
        } else {
          user = Object.assign(user, data);
          this.changeState('verifyContact', user);
        }
      });
  }

  signIn() {
    const { username, password } = this.inputs;
    if (!Auth || typeof Auth.signIn !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
    }
    Auth.signIn(username, password)
      .then(user => {
        logger.debug(user);
        if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
          logger.debug('confirm user with ' + user.challengeName);
          this.changeState('confirmSignIn', user);
        } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          logger.debug('require new password', user.challengeParam);
          this.changeState('requireNewPassword', user);
        } else if (user.challengeName === 'MFA_SETUP') {
          logger.debug('TOTP setup', user.challengeParam);
          this.changeState('TOTPSetup', user);
        }
        else {
          this.checkContact(user);
        }
      })
      .catch(err => {
        if (err.code === 'UserNotConfirmedException') {
          logger.debug('the user is not confirmed');
          this.changeState('confirmSignUp', { username });
        }
        else if (err.code === 'PasswordResetRequiredException') {
          logger.debug('the user requires a new password');
          this.changeState('forgotPassword', { username });
        } else {
          this.error(err);
        }
      });
  }

  showComponent(theme) {
    const { width } = this.state;
    // const isMobile = width <= 500;
    const isMobile = width <= 992;

    if (isMobile) {
      return (
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form>
                        <Row align="center" className="justify-content-center" style={{ margin: "20px" }}>
                          <Col md="4">
                            <img align="center" src={logo} alt="logo" width="75" height="75" />
                          </Col>
                        </Row>
                        <h1 align="center" style={{ fontSize: "20px", fontWeight: "bold", color: "#22b1dd", margin: "20px"  }}>Citizen Data Network</h1>
                        <p align="center" className="text-muted"><Button align="center" color="link" onClick={() => this.changeState('signUp')} className="px-0">Create free developer account</Button></p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-envelope"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            autoFocus
                            placeholder={I18n.get('Email')}
                            key="username"
                            name="username"
                            onChange={this.handleInputChange}
                          />
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder={I18n.get('Password')}
                            type="password"
                            key="password"
                            name="password"
                            onChange={this.handleInputChange}
                          />
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button color="link" onClick={() => this.changeState('forgotPassword')} className="px-0">Forgot password?</Button>
                          </Col>
                          <Col xs="6" className="text-right">
                            <Button onClick={this.signIn} color="primary" className="px-4">Login</Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
      );
    } else {
      return (
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form>
                        <Row align="center" className="justify-content-center" style={{ margin: "20px" }}>
                          <Col md="4">
                            <img align="center" src={logo} alt="logo" width="75" height="75" />
                          </Col>
                        </Row>
                        <h1 align="center" style={{ fontSize: "20px", fontWeight: "bold", color: "#22b1dd", margin: "20px" }}>Citizen Data Network</h1>
                     
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-envelope"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            autoFocus
                            placeholder={I18n.get('Email')}
                            key="username"
                            name="username"
                            onChange={this.handleInputChange}
                          />
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder={I18n.get('Password')}
                            type="password"
                            key="password"
                            name="password"
                            onChange={this.handleInputChange}
                          />
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button color="link" onClick={() => this.changeState('forgotPassword')} className="px-0">Forgot password?</Button>

                          </Col>
                          <Col xs="6" className="text-right">
                            <Button onClick={this.signIn} color="primary" className="px-4">Login</Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                  <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>

                    <CardBody className="text-center">
                      <div>
                        <h2 style={{ fontWeight: "bold", margin: "20px" }}>Sign up</h2>
                        <p>Leverage the blockchain for tamper-proof data and documents</p>
                        <Button color="primary" onClick={() => this.changeState('signUp')} className="mt-3" active>Create free developer account</Button>
                      </div>
                    </CardBody>
                  </Card>

                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
  }
}
