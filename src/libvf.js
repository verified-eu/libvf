import 'idempotent-babel-polyfill';
import Authenticator from './auth';
import EnvelopeActions from './envelopes/actions'
import CompanyActions from './companies/actions'
import OIDC from './oidc/index'

export let auth = Authenticator;
export let envelopes = EnvelopeActions;
export let companies = CompanyActions;
export let oidc = OIDC;
