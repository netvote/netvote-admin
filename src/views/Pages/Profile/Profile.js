import React, { Component } from 'react';
import { NetVoteAdmin } from '../../../lib';
import { Auth } from 'aws-amplify';
import * as moment from 'moment';
import * as STRIPE from '../../../config/stripe-settings';

import logo from '../../../assets/img/brand/cd-logo.png'

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
  UncontrolledTooltip,
  Form, FormGroup, Label, Input, FormFeedback, FormText
} from 'reactstrap';

import { Elements } from 'react-stripe-elements';
import { ConsoleLogger } from '@aws-amplify/core';

function getFormattedDate(created) {
  let createDate = moment(created).format('MM-DD-YYYY');

  return createDate;
}
/* eslint no-unused-vars: "off" */

const SUPPORT_PACKAGE = 'Support Package';
const USAGE_PLAN = 'Usage Plan';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.accountType = this.loadData.bind(this);
    this.toggleChangePasswordModal = this.toggleChangePasswordModal.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);

    this.enableExistingCustomer = this.enableExistingCustomer.bind(this);


    this.togglePaymentModal = this.togglePaymentModal.bind(this);

    //AWS Auth
    this.handleInputChange = this.handleInputChange.bind(this);
    this.submit = this.submit.bind(this);

    this.state = {
      accountType: '',
      existingCustomer: false,
      supportPackagesNames: [],
      usagePlanNames: [],
      updateDisabled: false
    };

    this.inputs = {};
  };


  purchasePlan() {
    const { subPlan, supportPkg } = this.inputs;

    //Get aggregated list of plan items 
    let allItems = this.getAllItems(subPlan, supportPkg);

    console.log('purchasePlan() allItems: ', allItems);

    var stripe = window.Stripe(STRIPE.PUB_KEY, {
      betas: ['checkout_beta_4']
    });

    console.log('Tenant Id: ' + this.state.tenantId);

    //Stripe Checkout Process
    stripe.redirectToCheckout({

      // Example items: [{ plan: 'plan_E9czHXpV9w9OZ2', quantity: 1 }],
      items: allItems,

      clientReferenceId: this.state.tenantId,

      // Note that it is not guaranteed your customers will be redirected to this
      // URL *100%* of the time, it's possible that they could e.g. close the
      // tab between form submission and the redirect.
      successUrl: STRIPE.SUCCESS_URL,
      cancelUrl: STRIPE.CANCEL_URL,

    }).then(function (result) {
      console.log('purchasePlan() Error: ' + result);

      if (result.error) {

        this.setState({
          errorTitle: `Purchase Plan`,
          errorMessage: result.error.message
        });

        this.toggleError();
      }
    }).catch(e => {
      console.log('PurchasePlan() Error: ', e.message);

      this.setState({
        errorTitle: `Purchase Plan`,
        errorMessage: e.message
      });

      this.toggleError();

    })
  }


  updatePlan = async () => {
    const { subPlan, supportPkg } = this.inputs;

    //Disable Update Button
    this.setState({
      updateDisabled: true
    });

    //Parse Ids from user selections
    var subPlanId = this.getInputId(subPlan);
    var supportId = this.getInputId(supportPkg)

    //Subscription Plan Items
    let usagePlan = this.getPlansByName(this.state.stripeBillingPlans, USAGE_PLAN, subPlanId);

    //Support Package Items
    let supportPlan = this.getPlansByName(this.state.stripeBillingPlans, SUPPORT_PACKAGE, supportId);

    //Create backend update plan info
    let updatePlans = { usagePlanId: `${usagePlan}`, supportPlanId: `${supportPlan}` };

    //Send the updated plans to our server
    console.log("updatePlan() sending : ", JSON.stringify(updatePlans));
    let response = await new NetVoteAdmin().setSubscriptionPlans(updatePlans);

    console.log('updatePlan() response: ', response);

    if (response["result"] === "ok") {
      //Show response message
      this.setState({
        successTitle: `Update Plan`,
        successMessage: `Your service plans have been updated`,
        supportPlanLevel: supportId || "None",
        usagePlanLevel: subPlanId || "None",
      });

      this.toggleSuccess();

    } else {
      //Show error message
      this.setState({
        errorTitle: `Update Plan`,
        errorMessage: `${response["message"]}`
      });

      this.toggleError();

    }

    this.setState({
      updateDisabled: false
    });

  }

  getAllItems(subPlan, supportPkg) {

    //Parse Ids from user selections
    var subPlanId = this.getInputId(subPlan);
    var supportId = this.getInputId(supportPkg);

    console.log('Selected subPlanId:', subPlanId + ".");
    console.log('Selected supportId:', supportId + ".");

    //Subscription Plan Items
    let usagePlans = this.getPlansByName(this.state.stripeBillingPlans, USAGE_PLAN, subPlanId);
    let usageItems = this.getItemsFromListOfPlans(usagePlans);
    console.log('usageItems: ', usageItems);

    //Support Package Items
    let supportPlans = this.getPlansByName(this.state.stripeBillingPlans, SUPPORT_PACKAGE, supportId);
    let supportItems = this.getItemsFromListOfPlans(supportPlans);
    console.log('supportItems: ', supportItems);

    //Aggregate All items for update/checkout
    let totalItems = usageItems.concat(supportItems);
    console.log('Total Plan Items: ', totalItems);

    return totalItems;
  }

  getInputId(selectedValue) {
    if (selectedValue !== undefined) {
      return (selectedValue.split("-", 1)[0]).replace(/ /g, "");
    } else {
      return 'Developer';
    }
  }

  toggleSuccess() {
    this.setState({
      success: !this.state.success,
    });
  }

  enableExistingCustomer() {

    //Always set to true - used by payment form modal
    this.setState({
      existingCustomer: true
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

    console.log('tenantInfo: ', tenantInfo);

    this.setState({
      accountType: tenantInfo["accountType"],
      accountOwner: tenantInfo["owner"],
      maxApiKeys: tenantInfo["maxApiKeys"],
      createdAt: tenantInfo["createdAt"],
      tenantId: tenantInfo["tenantId"],
      stripeCustomer: tenantInfo["stripeCustomer"],
      supportPlanLevel: tenantInfo["supportPlanLevel"] || "None",
      usagePlanLevel: tenantInfo["usagePlanLevel"] || "None",
    });

    //Set Stripe Customer Information
    if (this.state.stripeCustomer !== undefined) {

      console.log('stripeCustomer: ', this.state.stripeCustomer);

      if (this.state.stripeCustomer["id"] !== undefined) {
        console.log('stripeCustomerId: ', this.state.stripeCustomer["id"]);

        this.setState({
          existingCustomer: true
        });
      }
    }

    //Get Stripe Billing Plans
    let stripeBillingPlans = await netVoteAdmin.getStripeBillingPlans();

    this.setState({
      stripeBillingPlans: stripeBillingPlans
    });

    console.log('stripeBillingPlans: ', this.state.stripeBillingPlans);

    //Get Citizen Data Support Package Names
    let supportPackagesNames = this.getSelectionNames(stripeBillingPlans, SUPPORT_PACKAGE);

    //Get Citizen Data Usage Plan Names
    let usagePlanNames = this.getSelectionNames(stripeBillingPlans, USAGE_PLAN);

    //Save support packages list for select dropdown
    this.setState({
      supportPackagesNames: supportPackagesNames,
      usagePlanNames: usagePlanNames
    });

  }

  componentDidMount = async () => {
    await this.loadData();

    console.log('Existing Customer: ', this.state.existingCustomer);
  }

  getPlansByName(stripeBillingPlans, key, name) {
    let plans = [];

    let entries = Object.entries(stripeBillingPlans[key][name]["plans"]);

    // destructure the array into its key and property - index internal
    for (const [index, value] of entries) {
      plans.push(value);
    }

    return plans;
  }

  getItemsFromListOfPlans(plans) {

    let items = [];
    const entries = Object.entries(plans)

    // destructure the array into its key and property - index internal
    for (const [index, plan] of entries) {
      let item = { plan: `${plan}`, quantity: 1 };
      items.push(item);
    }

    return items;
  }

  getSelectionNames(stripeBillingPlans, key) {
    let namesList = [];

    const entries = Object.entries(stripeBillingPlans[key]);

    //Add price to names
    for (const [name, key] of entries) {

      let itemTitle = `${name} - ${key["monthlyPrice"]} Monthly`;

      if (key["usagePrice"] !== undefined) {
        itemTitle += ` / Billing rate ${key["usagePrice"]} USD per transaction`;
      }

      if (key["includedTx"] !== undefined && key["includedTx"] !== "0") {
        itemTitle += ` / Includes ${key["includedTx"]} blockchain transactions`;
      }

      //Add item to list
      namesList.push(itemTitle);

    }

    //Sort list
    namesList = namesList.sort(function(a, b){
      let price_a = parseFloat(a.split("$")[1]);
      let price_b = parseFloat(b.split("$")[1]);
      
      return price_a > price_b ? 1 : price_a < price_b ? -1 : 0;
    });

    return namesList;
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

    let supportOptions = this.state.supportPackagesNames.map(function (key, index) {
      if (this.state.existingCustomer) {
        return <option key={key}>{key}</option>;
      } else {
        return <option key={key}>No payment method</option>;
      }
    }, this);

    let usageOptions = this.state.usagePlanNames.map(function (key, index) {
      if (this.state.existingCustomer) {
        return <option key={key}>{key}</option>;
      } else {
        return <option key={key}>No payment method</option>;
      }
    }, this);

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card style={{ marginTop: 30 + 'px' }}>
              <CardHeader style={{ fontWeight: "bold", color: "#22b1dd" }}>
                <i className="fa fa-user-o fa-align-justify fa-lg"></i><strong>User Details</strong>
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
        <Row>
          <Col>
            <Card style={{ marginTop: 30 + 'px' }}>
              <CardHeader style={{ fontWeight: "bold", color: "#22b1dd" }}>
                <img src={logo} alt="CitizenData" width="25" height="25" border="0" /><strong>&nbsp;Service Plans</strong>
                <strong hidden={STRIPE.LIVEMODE} style={{ fontSize: "12px", fontWeight: "bold", color: "orange", margin: "20px" }}>TEST MODE</strong>
                <span className="ml-auto" >
                  <a href="https://citizendata.network/pricing/" target="_blank" rel='noopener noreferrer'>  <i id="subHelp" className={"fa fa-question-circle-o float-right fa-lg "} ></i></a>
                  <UncontrolledTooltip placement="right" target="subHelp">
                    Pricing Details
                </UncontrolledTooltip>
                </span>
              </CardHeader>
              <CardBody>

                <FormGroup>
                  <FormText style={{ fontSize: "13px", fontWeight: "bold" }} color="primary">
                    <strong>Current Usage Level: {this.state.usagePlanLevel}</strong>
                  </FormText>
                  <hr />
                  <FormText color="muted">
                    Your first 100 blockchain write transactions a month are free, every transaction after is billed at $0.10 USD.
                    Purchase a transaction subscription for lower rates.
                    All read and configuration transactions are free.  Gas costs when using public blockchains are billed at current market rates.
                  </FormText>
                  <br />

                  <Label style={{ fontWeight: "bold", color: "#5a636b" }} for="subPlan">Transaction Subscription:</Label>
                  <Input disabled={!this.state.existingCustomer} type="select" name="subPlan" id="subPlan" onChange={this.handleInputChange} >
                    {usageOptions}
                  </Input>
                </FormGroup>
                <br />

                <FormGroup>
                  <FormText style={{ fontSize: "13px", fontWeight: "bold" }} color="primary">
                    <strong>Current Support Level: {this.state.supportPlanLevel}</strong>
                  </FormText>
                  <hr />
                  <FormText color="muted">
                    Citizen Data provides a variety of support packages to meet your needs.
                  </FormText>
                  <br />
                  <Label style={{ fontWeight: "bold", color: "#5a636b" }} for="supportPkg">Support Package:</Label>
                  <Input disabled={!this.state.existingCustomer} type="select" name="supportPkg" id="supportPkg" onChange={this.handleInputChange}>
                    {supportOptions}
                  </Input>
                </FormGroup>
                <Button className="float-right" color="primary" disabled={this.state.updateDisabled} onClick={() => this.updatePlan()} hidden={!this.state.existingCustomer}>&nbsp;Update Plans</Button>
                <Button className="float-right" style={{ fontWeight: "bold", backgroundColor: "#20d86b", color: "white" }} onClick={() => this.onPaymentBtnClick()} hidden={this.state.existingCustomer}>&nbsp;Add Payment Method</Button>
                {/* <Button className="float-right" color="primary" onClick={() => this.purchasePlan()} hidden={this.state.existingCustomer}>&nbsp;Purchase</Button> */}

              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card hidden={!this.state.existingCustomer} style={{ marginTop: 30 + 'px' }} >
              <CardHeader style={{ fontWeight: "bold", color: "#22b1dd" }}>
                <i className="fa fa-credit-card fa-align-justify fa-lg"></i><strong>Billing Information</strong>
              </CardHeader>
              <CardBody>
                <Form inline>
                  <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  </FormGroup>
                  <Button color="primary" onClick={() => this.onPaymentBtnClick()}>&nbsp;Update Payment Method</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card style={{ marginTop: 30 + 'px' }}>
              <CardHeader style={{ fontWeight: "bold", color: "#22b1dd" }}>
                <i className="icon-lock fa-align-justify fa-lg"></i><strong>Admin Credentials</strong>
              </CardHeader>
              <CardBody>
                <Form inline>
                  <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="password" className="mr-sm-2">Password:</Label>
                    <Input type="password" name="password" id="password" placeholder="" value="                " disabled />
                  </FormGroup>
                  <Button className="float-right" color="primary" onClick={() => this.onChangePasswordBtnClick()}>Change Password</Button>
                </Form>
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
          <ModalHeader toggle={this.togglePaymentModal}><i className="fa fa-credit-card"></i>&nbsp;Billing Information</ModalHeader>
          <ModalBody id="modalBodyText" style={{ margin: "20px" }} >
            <Elements>
              <InjectedPaymentForm togglePaymentModal={this.togglePaymentModal} enableExistingCustomer={this.enableExistingCustomer} />
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
