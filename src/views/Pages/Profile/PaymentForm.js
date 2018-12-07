import React from 'react';

import {
  Button,
  Col,
  Form, FormGroup, Label,
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

    this.state = {
      elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
      complete: false
    };

    this.inputs = {};
  };

  //TODO: OPTION 1
  //Tokenizes the card information and sends it to Citizen Data server
  handleSubmit = (ev) => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken({ name: 'Eric Clapton' }).then(({ token }) => {
      console.log('Received Stripe token:', token);

       //TODO: send the token to our server. This example shows how to send the token ID in the body of a POST request
       if (token !== undefined) {
        this.setState({complete: true});
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

  //TODO: OPTION 2
  // async submit(ev) {
  //   let {token} = await this.props.stripe.createToken({name: "Name"});
  //   let response = await fetch("/charge", {
  //     method: "POST",
  //     headers: {"Content-Type": "text/plain"},
  //     body: token.id
  //   });
  
  //   if (response.error) {
  //     // TODO: Inform the customer that there was an error.
  //     console.log("ERROR: " + response.error.message);
  //   } else {
  //     // TODO: Send the token to Citizen Data server. (response.token)
  //   }

  //   if (response.ok) console.log("Purchase Complete!")
  // }


  handleBlur = () => {
    console.log('[blur]');
  };
  
  handleChange = (change) => {
    console.log('[change]', change);
  };
  
  handleClick = () => {
    console.log('[click]');
  };
  
  handleFocus = () => {
    console.log('[focus]');
  };
  
  handleReady = () => {
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
    //TODO -- Convert to modal
    if (this.state.complete) return <h1 style={{ fontWeight: "bold", color: "green" }}>Payment details sent to Citizen Data server</h1>;

    return (

      // <Form onSubmit={this.handleSubmit}>
      <Form>
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
          <Label for="expDate" style={{ fontWeight: "bold", color: "#22b1dd" }}>Expiration date</Label>

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
            <Button color="primary" onClick={this.handleSubmit}>Send</Button> 
          </Col>
      </Form>
    );
  }
}

export default injectStripe(PaymemtForm);


