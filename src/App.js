import React, { Component } from 'react';
import Amplify from 'aws-amplify';

import { Navigator, Main} from './components';
import './App.css';

import { withAuthenticator } from 'aws-amplify-react';

//Netvote Admin AWS Settings
import * as aws_settings from './config/aws-settings';

Amplify.Logger.LOG_LEVEL = 'INFO'; // We write INFO level logs throughout app

//Manually Configure AWS Amplify
Amplify.configure({
  Auth: {

      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
      
      // REQUIRED - Amazon Cognito Region
      region: aws_settings.AWS_AUTH_REGION,

      // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
      // Required only if it's different from Amazon Cognito Region
      // identityPoolRegion: 'XX-XXXX-X',

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: aws_settings.AWS_AUTH_USER_POOL_ID,

      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: aws_settings.AWS_AUTH_USER_POOL_WEB_CLIENT_ID,

      // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: true,

      // OPTIONAL - Configuration for cookie storage
      // cookieStorage: {
      // // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      //     domain: '.yourdomain.com',
      // // OPTIONAL - Cookie path
      //     path: '/',
      // // OPTIONAL - Cookie expiration in days
      //     expires: 365,
      // // OPTIONAL - Cookie secure flag
      //     secure: true
      // },

      // OPTIONAL - customized storage object
      // storage: new MyStorage(),
      
      // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
      // authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
});

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navigator />
        <Main />
      </React.Fragment>
    );
  }
}

// export default App;
// export default withAuthenticator(App, true); // Render a sign out button once logged in
export default withAuthenticator(App);