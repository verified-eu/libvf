import 'idempotent-babel-polyfill';
import Authenticator from './auth';
import EnvelopeActions from './envelopes/actions'
import CompanyActions from './companies/actions'
import OIDC from './oidc/index'
import IDRights from './idrights/index'
import Bisnode from './bisnode/index';

/** @namespace auth */
export let auth = Authenticator;

/** @namespace envelopes */
export let envelopes = EnvelopeActions;

/** @namespace companies */
export let companies = CompanyActions;

/** @namespace oidc */
export let oidc = OIDC;

/** @namespace idrights */
export let idrights = IDRights;

/** @namespace bisnode */
export let bisnode = Bisnode;