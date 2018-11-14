import * as React from 'react';
import { Input, Button, Card, CardBody, Col, Container, Form, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

import Auth from '@aws-amplify/auth'
import { AuthPiece } from 'aws-amplify-react'

import { I18n } from '@aws-amplify/core';

export default class SignUp extends AuthPiece {
  constructor(props) {
    super(props);

    this._validAuthStates = ['signUp'];
    this.signUp = this.signUp.bind(this);

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

  showComponent(theme) {
    const { hide } = this.props;
    if (hide && hide.includes(SignUp)) { return null; }

    return (
      // <div className="app flex-row align-items-center">
      <div className="app flex-row" style={{ position: "relative", top: "73px" }}>
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    <h2 style={{ fontWeight: "bold", color: "#22b1dd" }}>CitizenData</h2>
                    <p className="text-muted">Create your account</p>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>

                      <Input
                        autoFocus
                        placeholder={I18n.get('Username')}
                        key="username"
                        name="username"
                        onChange={this.handleInputChange}
                      />
                    </InputGroup>


                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="janedoe@email.com"
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

                    <Button onClick={this.signUp} color="primary" block>Create Account</Button>
                    <Button onClick={() => this.changeState('signIn')} color="primary" block>Sign In</Button>

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
