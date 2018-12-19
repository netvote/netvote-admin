import React from 'react';
import { NetVoteAdmin } from '../../../lib';

import {
  Button,
  Col,
  Form, FormGroup, Label,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';

import {
  // CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
  injectStripe,
} from 'react-stripe-elements';

class PaymemtForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);

    this.state = {
      elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
      complete: false,
      disableButton: false
    };

    this.inputs = {};
  };

  //Tokenizes the card information and sends it to Citizen Data server
  handleSubmit = (ev) => {
    // Prevent default form submission here, which would refresh the page.
    ev.preventDefault();

    //Disable button 
    this.setState({
      disableButton: true
    });

    // STEP 1 - Create Stripe Token
    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken().then(async ({ token, error }) => {
      console.log('Received Stripe token:', token);

      //STEP 2 - Send Stripe Token to Citizen Data server
      if (token !== undefined) {

        //Send the token to our server
        console.log("sending token: " + token.id);
        let response = await new NetVoteAdmin().setPaymentMethod(token.id);

        console.log(response);

        if (response["code"] !== undefined) {
          //Show error message
          this.setState({
            errorTitle: `Update Payment`,
            errorMessage: `${response["message"]}`
          });

          this.toggleError();

        } else {

          //Set Customer exists flag
          this.props.enableExistingCustomer();

          // //Show response message
          // this.setState({
          //   successTitle: `Update Payment`,
          //   successMessage: `${response["message"]}`
          // });


          // this.toggleSuccess();
          
          //Toggle payment modal
          this.setState({ complete: true });
        }

      } else {
        //enable button 
        this.setState({
          disableButton: false
        });

        //Show  Error
        console.log('Stripe token error :', error);

        this.setState({
          errorTitle: `Payment Error`,
          errorMessage: error.message
        });

        this.toggleError();
      }
    });
  };

  toggleError() {
    this.setState({
      error: !this.state.error,
    });
  }

  toggleSuccess() {
    this.setState({
      success: !this.state.success,
    });
  }

  handleBlur = () => {
    console.log('[blur]');
  };

  handleChange = (change) => {
    console.log('[change]', change);

    console.log('[change] Value: ', change.value);

    if (change.error !== undefined) {

      //Show Change Error
      console.log('[change] ERROR: ' + change.error.message)

      this.setState({
        errorTitle: `Payment Error`,
        errorMessage: change.error.message
      });

      this.toggleError();
    }

  };

  handleClick = () => {
    console.log('[click]');
  };

  handleFocus = () => {
    console.log('[focus]');
  };

  handleReady = (el) => {
    console.log('[ready]');
  };

  createOptions = (fontSize, padding) => {
    return {
      style: {
        base: {
          iconColor: '#666ee8',
          color: '#31325f',
          fontWeight: 400,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
          fontSmoothing: 'antialiased',
          fontSize,
          '::placeholder': {
            color: '#aab7c4',
          },
          padding,
          ':-webkit-autofill': {
            color: '#666ee8',
          },
        },

        invalid: {
          color: '#9e2146',
        },
      },
    };
  };

  render() {

    if (this.state.complete) {
      //Show completed message
      return (
        <h5 align="center" style={{ fontSize: "14px", fontWeight: "bold", color: "#22b1dd", margin: "20px" }}>Your payment details have been updated</h5>
      );
    } else {

      return (
        <div className="animated fadeIn">
          <Form>
            {/* <CardElement/> */}
            <FormGroup>
              <Label for="cardNumber" style={{ fontWeight: "bold", color: "#22b1dd" }}>Card Number</Label>
              <CardNumberElement
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onReady={(el) => el.focus()}
                // onReady={this.handleReady}
                {...this.createOptions(this.props.fontSize)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="expDate" style={{ fontWeight: "bold", color: "#22b1dd" }}>Expiration</Label>

              <CardExpiryElement
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onReady={this.handleReady}
                {...this.createOptions(this.props.fontSize)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="cvc" style={{ fontWeight: "bold", color: "#22b1dd" }}>CVC</Label>

              <CardCVCElement
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onReady={this.handleReady}
                {...this.createOptions(this.props.fontSize)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="postalCode" style={{ fontWeight: "bold", color: "#22b1dd" }}>Postal code</Label>

              <PostalCodeElement
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onReady={this.handleReady}
                {...this.createOptions(this.props.fontSize)}
              />
            </FormGroup>
            <Col align="center" style={{ margin: "10px", paddingLeft: "10px" }}>
              <Button color="primary" disabled={this.state.disableButton} onClick={this.handleSubmit}>Update Card</Button>
            </Col>
          </Form>
          <Modal isOpen={this.state.error} centered={true} toggle={this.toggleError}
            className={'modal-danger ' + this.props.className}>
            <ModalHeader toggle={this.toggleError}>{this.state.errorTitle}</ModalHeader>
            <ModalBody style={{ fontWeight: "bold", color: "red", backgroundColor: "#ee909057" }}>
              {this.state.errorMessage}
            </ModalBody>
          </Modal>
          <Modal isOpen={this.state.success} centered={true} toggle={this.toggleSuccess}
            className={'modal-success ' + this.props.className}>
            <ModalHeader toggle={this.toggleSuccess}>{this.state.successTitle}</ModalHeader>
            <ModalBody style={{ fontWeight: "bold", color: "green", backgroundColor: "#90ee9057" }}>
              {this.state.successMessage}
            </ModalBody>
          </Modal>
        </div>
      );
    }
  }
}

export default injectStripe(PaymemtForm);


