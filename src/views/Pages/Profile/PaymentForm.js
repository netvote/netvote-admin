import React from 'react';
import { NetVoteAdmin } from '../../../lib';

import {
  Button,
  Col,
  Form, FormGroup, Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

import {
  CardElement,
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
      complete: false
    };

    this.inputs = {};
  };

  //TODO: Server side integration
  //Tokenizes the card information and sends it to Citizen Data server
  handleSubmit = (ev) => {
    // Prevent default form submission here, which would refresh the page.
    ev.preventDefault();

    // STEP 1 - Create Stripe Token
    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken({ name: 'Eric Clapton' }).then(async ({ token, error }) => {
      console.log('Received Stripe token:', token);

      //TODO: Display errors in modal
      if (error !== undefined) {

        //Show  Error
        console.log('Stripe token error :', error);

        this.setState({
          errorTitle: `Payment Error`,
          errorMessage: error.message
        });

        this.toggleError();
      }

      //STEP 2 - Send Stripe Token to Citizen Data server
      if (token !== undefined) {

        //TODO: Server-side endpoints needed

        //TODO: send the token to our server. This example shows how to send the token ID in the body of a POST request
        console.log("sending token: "+token.id);
        let response = await new NetVoteAdmin().setPaymentMethod(token.id);

        console.log(response);

        if (response.error) {
          // TODO: Inform the customer that there was an error.
          console.log("ERROR: " + response.error.message);
        } else {
          // All good
        }

        //   if (response.ok) console.log("Purchase Complete!")
        this.setState({ complete: true });

        // this.setState({
        //   successTitle: `Update Payment`,
        //   successMessage: `Payment details sent to Citizen Data server`
        // });

        // this.toggleSuccess();
      }
    });

    // However, this line of code will do the same thing:
    //
    // this.props.stripe.createToken({type: 'card', name: 'Eric Clapton'});

    // You can also use createSource to create Sources. See our Sources
    // documentation for more: https://stripe.com/docs/stripe-js/reference#stripe-create-source
    //
    // this.props.stripe.createSource({type: 'card', owner: {
    //   name: 'Eric Clapton'
    // }});
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
      return <h1 style={{ fontWeight: "bold", color: "green" }}>Payment details sent to Citizen Data server</h1>;
    }

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
            <Button color="primary" disabled={this.state.complete} onClick={this.handleSubmit}>Update Card</Button>
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

export default injectStripe(PaymemtForm);


