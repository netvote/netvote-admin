//Stripe Publishable Keys
export const PUB_KEY = process.env.NODE_ENV === 'production'
  ? 'pk_live_inmG9y3aVMj1j1gBiVd5uuq8' //LIVE KEY
  : 'pk_test_inmG9y3aVMj1j1gBiVd5uuq8'; //TEST KEY

//Stripe payment server
export const PAYMENT_SERVER_URL = process.env.NODE_ENV === 'production'
  ? 'http://myapidomain.com'
  : 'http://localhost:8080';
