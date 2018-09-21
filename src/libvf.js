import Authenticator from './auth';
import EnvelopeActions from './envelopes/actions'

// The object we expose for the user
const libvf = {
  auth: Authenticator.getInstance(),  
  envelopes: new EnvelopeActions()
}

module.exports = libvf;
