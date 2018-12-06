export const PUBLISHABLE_KEY = process.env.NODE_ENV === 'production'
  ? 'pk_live_MY_PUBLISHABLE_KEY'
  : 'pk_test_inmG9y3aVMj1j1gBiVd5uuq8';

export const PAYMENT_SERVER_URL = process.env.NODE_ENV === 'production'
  ? 'http://myapidomain.com'
  : 'http://localhost:8080';
