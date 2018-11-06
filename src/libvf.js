import '@babel/polyfill';
import Authenticator from './auth';
import EnvelopeActions from './envelopes/actions'
import CompanyActions from './companies/actions'

export let auth = Authenticator;
export let envelopes = EnvelopeActions;
export let companies = CompanyActions;
