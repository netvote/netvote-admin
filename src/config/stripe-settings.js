//Stripe Publishable Keys
export const PUB_KEY = process.env.NODE_ENV === 'production'
  ? 'pk_live_bZkSaMKnR6Trg6AC6i7PTnas' //LIVE KEY
  : 'pk_test_inmG9y3aVMj1j1gBiVd5uuq8'; //TEST KEY

//Stripe payment server
export const PAYMENT_SERVER_URL = process.env.NODE_ENV === 'production'
  ? 'http://myapidomain.com'
  : 'http://localhost:8080';

  export const LIVEMODE = process.env.NODE_ENV === 'production'
  ? true //LIVE 
  : false; //TEST 

  export const CANCEL_URL = process.env.NODE_ENV === 'production'
  ? 'https://citizendata.network/#/profile' //LIVE 
  : 'http://localhost:3000/#/profile'; //TEST 

  export const SUCCESS_URL = process.env.NODE_ENV === 'production'
  ? 'https://citizendata.network/#/profile' //LIVE 
  : 'http://localhost:3000/#/profile'; //TEST 