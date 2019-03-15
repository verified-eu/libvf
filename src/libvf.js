import 'idempotent-babel-polyfill';
import Authenticator from './auth';
import EnvelopeActions from './envelopes/actions'
import CompanyActions from './companies/actions'
import OIDC from './oidc/index'

/** @namespace auth */
export let auth = Authenticator;

/** @namespace envelopes */
export let envelopes = EnvelopeActions;

/** @namespace companies */
export let companies = CompanyActions;

/** @namespace oidc */
export let oidc = OIDC;
