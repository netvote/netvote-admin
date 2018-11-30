import * as React from 'react';
import { FormGroup, Input, Button, Card, CardBody, Col, Container, Form, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

import Auth from '@aws-amplify/auth'
import { AuthPiece } from 'aws-amplify-react'

import { I18n, ConsoleLogger as Logger } from '@aws-amplify/core';

import logo from '../../../assets/img/brand/cd-logo.png'

const logger = new Logger('ForgotPassword');

export default class ForgotPassword extends AuthPiece {
  constructor(props) {
    super(props);

    this.send = this.send.bind(this);
    this.submit = this.submit.bind(this);

    this._validAuthStates = ['forgotPassword'];
    this.state = { delivery: null };
  }

  send() {
    const { authData = {} } = this.props;
    const username = this.inputs.username || authData.username;
    if (!Auth || typeof Auth.forgotPassword !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
    }
    Auth.forgotPassword(username)
      .then(data => {
        logger.debug(data)
        this.setState({ delivery: data.CodeDeliveryDetails });
      })
      .catch(err => this.error(err));
  }

  submit() {
    const { authData = {} } = this.props;
    const { code, password } = this.inputs;
    const username = this.inputs.username || authData.username;

    if (!Auth || typeof Auth.forgotPasswordSubmit !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
    }
    Auth.forgotPasswordSubmit(username, code, password)
      .then(data => {
        logger.debug(data);
        this.changeState('signIn');
        this.setState({ delivery: null });
      })
      .catch(err => this.error(err));
  }

  sendView() {
    return (
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
    );
  }

  submitView() {

    return (
      <FormGroup>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="icon-key"></i>
            </InputGroupText>
          </InputGroupAddon>
          <Input
            autoFocus
            placeholder={I18n.get('Code')}
            key="code"
            name="code"
            autoComplete="off"
            onChange={this.handleInputChange}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="icon-lock"></i>
            </InputGroupText>
          </InputGroupAddon>
          <Input
            autoFocus
            placeholder={I18n.get('New Password')}
            type="password"
            key="password"
            name="password"
            onChange={this.handleInputChange}
          />
        </InputGroup>
      </FormGroup>

    );
  }

  showComponent(theme) {
    const { authState, hide, authData = {} } = this.props;
    if (hide && hide.includes(ForgotPassword)) { return null; }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="p-4">
                <CardBody>
                  <Form>
                    <Row align="center" className="justify-content-center">
                      <Col md="4">
                        <img align="center" src={logo} alt="logo" width="75" height="75" />
                      </Col>
                    </Row>
                    <h1 align="center" style={{ fontSize: "20px", fontWeight: "bold", color: "#22b1dd", margin: "20px" }}>Citizen Data Network</h1>
                    <p align="center" style={{ fontWeight: "bold"}} className="text-muted">Reset your password</p>
                    <FormGroup>

                      {this.state.delivery || authData.username ? this.submitView() : this.sendView()}

                      <Row>
                        <Col xs="6">
                          {this.state.delivery || authData.username ?
                            <Button color="primary" onClick={this.send} block >Resend Code</Button> :
                            <Button onClick={() => this.changeState('signIn')} block>Sign In</Button>
                          }
                        </Col>
                        <Col xs="6" >
                          {this.state.delivery || authData.username ?
                            <Button color="primary" onClick={this.submit} block>Submit</Button> :
                            <Button color="primary" onClick={this.send} block>Send Code</Button>
                          }

                        </Col>
                      </Row>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}