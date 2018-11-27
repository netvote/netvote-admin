import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';

import Amplify from 'aws-amplify';

import { ConfirmSignIn, ConfirmSignUp, RequireNewPassword, VerifyContact, withAuthenticator } from 'aws-amplify-react';

//Netvote Admin AWS Settings
import * as aws_settings from './config/aws-settings';

// Containers
import { DefaultLayout } from './containers';

//Custom CitizenData Login Pages
import { SignIn, SignUp, ForgotPassword} from './views/Pages';

Amplify.Logger.LOG_LEVEL = 'INFO'; // We write INFO level logs throughout app

let appConfig = {
  // REQUIRED - Amazon Cognito Region
  'region': aws_settings.AWS_AUTH_REGION,

  // OPTIONAL - Amazon Cognito User Pool ID
  'userPoolId': aws_settings.AWS_AUTH_USER_POOL_ID,

  // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  'userPoolWebClientId': aws_settings.AWS_AUTH_USER_POOL_WEB_CLIENT_ID,

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
      <HashRouter> 
       <Switch>
          <Route path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </HashRouter>
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