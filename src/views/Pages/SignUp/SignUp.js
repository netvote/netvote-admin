import * as React from 'react';
import { FormGroup, Label, Input, Button, Card, CardBody, Col, Container, Form, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

import Auth from '@aws-amplify/auth'
import { AuthPiece } from 'aws-amplify-react'

import { I18n } from '@aws-amplify/core';

import logo from '../../../assets/img/brand/cd-logo.png'

export default class SignUp extends AuthPiece {
  constructor(props) {
    super(props);

    this._validAuthStates = ['signUp'];
    this.signUp = this.signUp.bind(this);
    this.toggleSignupButton = this.toggleSignupButton.bind(this);

    this.inputs = {
      dial_code: "+1",
    };
  }

  signUp() {
    const { username, password, email, dial_code = '+1', phone_line_number } = this.inputs;

    if (!Auth || typeof Auth.signUp !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
    }

    let signup_info = {
      username,
      password,
      attributes: {
        email
      }
    };

    let phone_number = phone_line_number ? `${dial_code}${phone_line_number.replace(/[-()]/g, '')}` : null;

    if (phone_number) {
      signup_info.attributes.phone_number = phone_number;
    }

    Auth.signUp(signup_info).then(() => {
      console.log('username: ' + username);

      this.changeState('confirmSignUp', username);

    }).catch(err => this.error(err));
  }

  toggleSignupButton() {
    let acceptCheckbox = document.getElementById("acceptBox");
    this.setState({ hideSignupButton: acceptCheckbox.checked });
  }

  componentDidMount = async () => {
    this.setState({ hideSignupButton: false });
  }

  showComponent(theme) {
    const { hide } = this.props;
    if (hide && hide.includes(SignUp)) { return null; }

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
                    <h1 align="center" style={{ fontSize: "20px", fontWeight: "bold", color: "#22b1dd", margin: "20px"  }}>Citizen Data Network</h1>
                    <p align="center" style={{ fontWeight: "bold"}} className="text-muted">Create your account</p>
                    <FormGroup>
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
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-envelope"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Confirm email"
                          key="email"
                          name="email"
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
                          placeholder={I18n.get('Password')}
                          type="password"
                          key="password"
                          name="password"
                          onChange={this.handleInputChange}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-phone"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="555-555-1212"
                          key="phone_line_number"
                          name="phone_line_number"
                          onChange={this.handleInputChange}
                        />
                      </InputGroup>
                      {/* <Col align="center" sm={{ offset: 2 }}> */}
                      <Col align="center" style={{ margin: "10px", paddingLeft: "10px" }}>
                        <InputGroup className="mb-4">
                          <Label check>
                            <Input align="center" name="acceptBox" id="acceptBox" type="checkbox" onChange={this.toggleSignupButton} />
                            I have read and accept the <a href="https://citizendata.network/terms-of-service" target="_blank" rel='noopener noreferrer'>Terms of Service</a>
                          </Label>
                        </InputGroup>
                      </Col>
                      <Button className="signupButton" name="signupButton" id="signupButton" onClick={this.signUp} color="primary" block disabled={!this.state.hideSignupButton}>Create Account</Button>
                      <Button onClick={() => this.changeState('signIn')} block>Sign In</Button>
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
