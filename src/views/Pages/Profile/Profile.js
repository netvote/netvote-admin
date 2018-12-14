import React, { Component } from 'react';
import { NetVoteAdmin } from '../../../lib';
import { Auth } from 'aws-amplify';
import * as moment from 'moment';
import * as STRIPE from '../../../config/stripe-settings';

import InjectedPaymentForm from './PaymentForm';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Form, FormGroup, Label, Input, FormFeedback, FormText
} from 'reactstrap';

import { Elements } from 'react-stripe-elements';

function getFormattedDate(created) {
  let createDate = moment(created).format('MM-DD-YYYY');

  return createDate;
}

class Profile extends Component {
  constructor(props) {
    super(props);

    this.accountType = this.loadData.bind(this);
    this.toggleChangePasswordModal = this.toggleChangePasswordModal.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);

    this.togglePaymentModal = this.togglePaymentModal.bind(this);

    //AWS Auth
    this.handleInputChange = this.handleInputChange.bind(this);
    this.submit = this.submit.bind(this);

    this.state = {
      accountType: '',
    };

    this.inputs = {};
  };
 

  onToken = (token) => {

    var stripe = window.Stripe(STRIPE.PUB_KEY, {
      betas: ['checkout_beta_4']
    });
  
    //Stripe Checkout Process
    stripe.redirectToCheckout({

      //TODO: CALL BACKEND TO GET LIST OF SUBSCRIPTION OPTIONS


      //TODO: CREATE SUBSCRIPTION PLAN DROPDOWN 
      items: [{plan: 'plan_E9czHXpV9w9OZ2', quantity: 1}],

      //TODO --- CREATE PROPER SUCCESS/CANCELLED PAGE

      // Note that it is not guaranteed your customers will be redirected to this
      // URL *100%* of the time, it's possible that they could e.g. close the
      // tab between form submission and the redirect.
      successUrl: 'https://citizendata.network/success',
      cancelUrl: 'https://citizendata.network/canceled',
    })
    .then(function (result) {
      //TODO: PROPER ERROR HANDLING
      if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer.
        
        // var displayError = document.getElementById('error-message');
        // displayError.textContent = result.error.message;
        alert(result.error.message);
      }
    });
  }

  toggleSuccess() {
    this.setState({
      success: !this.state.success,
    });
  }

  toggleError() {
    this.setState({
      error: !this.state.error,
    });
  }

  loadData = async () => {
    await Auth.currentSession()
    let netVoteAdmin = new NetVoteAdmin();

    //Retrieve Tenant Info
    let tenantInfo = await netVoteAdmin.getTentantInfo();

    //Set Tenant Account Message
    this.setState({
      accountType: tenantInfo["accountType"],
      accountOwner: tenantInfo["owner"],
      maxApiKeys: tenantInfo["maxApiKeys"],
      createdAt: tenantInfo["createdAt"],
    });
  }

  componentDidMount = async () => {
    await this.loadData();
  }

  toggleChangePasswordModal() {
    this.setState({
      primary: !this.state.primary,
    });
  }

  togglePaymentModal() {
    this.setState({
      payment: !this.state.payment,
    });
  }

  onChangePasswordBtnClick = async (id) => {
    //Show Modal
    this.toggleChangePasswordModal();
  }

  onPaymentBtnClick = async (id) => {
    //Show Modal
    this.togglePaymentModal();
  }

  handleInputChange(evt) {
    const { name, value } = evt.target;

    this.inputs = this.inputs || {};
    this.inputs[name] = value;
  }

  submit() {
    const { password, newPassword, confirmPassword } = this.inputs;

    //Validate confirmation password match
    if (newPassword !== confirmPassword) {
      //Show Password Change Error
      console.log('Change Password Error: Mismatch between passwords');

      this.setState({
        errorTitle: `Change Password`,
        errorMessage: `Please ensure new passwords match`
      });

      this.toggleError();
    } else {
      //Get Authenticated User
      Auth.currentAuthenticatedUser()
        .then(user => {
          //Change password
          return Auth.changePassword(user, password, newPassword);
        }).then(data => {
          //Successful Password Change
          console.log('Password Changed Successfully');

          this.setState({
            successTitle: `Change Password`,
            successMessage: `Your password has been changed`
          });

          this.toggleSuccess();

          //Hide Modal
          this.toggleChangePasswordModal();
        }).catch(err => {

          //Show Password Change Error
          console.log('Change Password Error: ' + err["message"]);

          this.setState({
            errorTitle: `Change Password`,
            errorMessage: `${err["message"]}`
          });

          this.toggleError();
        });
    }
  }
 
  render() {
    
  
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Button className="float-right" color="primary" onClick={() => this.onChangePasswordBtnClick()}><i className="fa fa-lock"></i>&nbsp;Change Password</Button>
          </Col>
          {/* <Col>
            <Button className="float-left" color="primary" onClick={() => this.onPaymentBtnClick()}><i className="fa fa-credit-card"></i>&nbsp;Update Payment Details</Button>
          </Col> */}
          <Col>
          <Button className="float-left" color="primary" onClick={() => this.onToken()}><i className="fa fa-credit-card"></i>&nbsp;Purchase Premium Support</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card style={{ marginTop: 30 + 'px' }}>
              <CardHeader>
                User Profile
                </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Owner</th>
                      <th>Max API Keys</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody id="userProfileTableData">
                    <tr>
                      <td>{this.state.accountType}</td>
                      <td>{this.state.accountOwner}</td>
                      <td>{this.state.maxApiKeys}</td>
                      <td>{getFormattedDate(this.state.createdAt)}</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal isOpen={this.state.primary} centered={true} toggle={this.toggleChangePasswordModal}
          className={'modal-primary ' + this.props.className} size="md" color="primary">
          <ModalHeader toggle={this.toggleChangePasswordModal}><i className="fa fa-lock"></i>&nbsp;Change Password</ModalHeader>
          <ModalBody id="modalBodyText" style={{ margin: "20px" }} >
            <Form>
              <FormGroup>
                <Label for="currentPassword" style={{ fontWeight: "bold", color: "#22b1dd" }}>Current Password</Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="icon-lock"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder='Current Password'
                    type="password"
                    key="password"
                    name="password"
                    id="password"
                    onChange={this.handleInputChange}
                  />
                </InputGroup>
                <FormFeedback>Error: Password is invalid!</FormFeedback>
                <FormText>Enter your current password</FormText>
              </FormGroup>

              <FormGroup>
                <Label for="newPassword" style={{ fontWeight: "bold", color: "#22b1dd" }}>New Password</Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="icon-lock"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder='New Password'
                    type="password"
                    key="newPassword"
                    name="newPassword"
                    id="newPassword"
                    onChange={this.handleInputChange}
                  />
                </InputGroup>
                <FormFeedback>Error: Password is invalid!</FormFeedback>
                <FormText>Enter your new password</FormText>
              </FormGroup>

              <FormGroup>
                <Label for="confirmPassword" style={{ fontWeight: "bold", color: "#22b1dd" }}>Confirm Password</Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="icon-lock"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder='New Password'
                    type="password"
                    key="confirmPassword"
                    name="confirmPassword"
                    onChange={this.handleInputChange}
                  />
                </InputGroup>
                <FormFeedback>Error: Password is invalid!</FormFeedback>
                <FormText>Re-enter your new password</FormText>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleChangePasswordModal}>Cancel</Button>
            <Button color="primary" onClick={this.submit}>Save</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.payment} centered={true} toggle={this.togglePaymentModal}
          className={'modal-primary ' + this.props.className} size="md" color="primary">
          <ModalHeader toggle={this.togglePaymentModal}><i className="fa fa-credit-card"></i>&nbsp;Payment Details</ModalHeader>
          <ModalBody id="modalBodyText" style={{ margin: "20px" }} >
            <Elements>
              <InjectedPaymentForm togglePaymentModal={this.togglePaymentModal} />
            </Elements>
          </ModalBody>
          {/* <ModalFooter> */}
          {/* <Button color="secondary" onClick={this.togglePaymentModal}>Cancel</Button> */}
          {/* <Button color="primary" onClick={this.handlePaymentSubmit}>Pay</Button> */}
          {/* </ModalFooter> */}
        </Modal>

        <Modal isOpen={this.state.success} centered={true} toggle={this.toggleSuccess}
          className={'modal-success ' + this.props.className}>
          <ModalHeader toggle={this.toggleSuccess}>{this.state.successTitle}</ModalHeader>
          <ModalBody style={{ fontWeight: "bold", color: "green", backgroundColor: "#90ee9057" }}>
            {this.state.successMessage}
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.error} centered={true} toggle={this.toggleError}
          className={'modal-danger ' + this.props.className}>
          <ModalHeader toggle={this.toggleError}>{this.state.errorTitle}</ModalHeader>
          <ModalBody style={{ fontWeight: "bold", color: "red", backgroundColor: "#ee909057" }}>
            {this.state.errorMessage}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Profile;
