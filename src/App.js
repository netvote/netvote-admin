import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';

import Amplify from 'aws-amplify';

import { ConfirmSignIn, ConfirmSignUp, RequireNewPassword, VerifyContact, withAuthenticator } from 'aws-amplify-react';

// AWS Settings
import * as AWS_SETTINGS from './config/aws-settings';

// Containers
import { DefaultLayout } from './containers';

// Stripe
import {Elements, StripeProvider} from 'react-stripe-elements';
import * as STRIPE_SETTINGS from './config/stripe-settings';

//Custom CitizenData Login Pages
import { SignIn, SignUp, ForgotPassword} from './views/Pages';

Amplify.Logger.LOG_LEVEL = 'INFO'; // We write INFO level logs throughout app

let appConfig = {
  // REQUIRED - Amazon Cognito Region
  'region': AWS_SETTINGS.AWS_AUTH_REGION,

  // OPTIONAL - Amazon Cognito User Pool ID
  'userPoolId': AWS_SETTINGS.AWS_AUTH_USER_POOL_ID,

  // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  'userPoolWebClientId': AWS_SETTINGS.AWS_AUTH_USER_POOL_WEB_CLIENT_ID,

  // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
  'mandatorySignIn': true,
}

//Production - Cookie Storage
if (window.location.hostname !== 'localhost') {
  appConfig.cookieStorage = {
    // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    domain: 'admin.citizendata.network',
    // // OPTIONAL - Cookie path
    path: '/',
    // // OPTIONAL - Cookie expiration in days
    expires: 1,
    // // OPTIONAL - Cookie secure flag
    secure: true
  }
};

//Manually Configure AWS Amplify
Amplify.configure(appConfig);

class App extends Component {
  render() { 
    return (
      <StripeProvider apiKey={STRIPE_SETTINGS.PUBLISHABLE_KEY}><Elements>
        <HashRouter> 
        <Switch>
            <Route path="/" name="Home" component={DefaultLayout} />
          </Switch>
        </HashRouter>
        </Elements>
    </StripeProvider>
    );
  }
}

// export default App;
// export default withAuthenticator(App);
export default withAuthenticator(App, false, [
  <SignIn/>, //Custom CitizenData SignIn
  <ConfirmSignIn/>,
  <VerifyContact/>,
  <SignUp/>, //Custom CitizenData Signup
  <ConfirmSignUp/>,
  <ForgotPassword/>, //Custom CitizenData ForgotPassword
  <RequireNewPassword />,
]);