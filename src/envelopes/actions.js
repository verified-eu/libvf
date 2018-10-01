import Authenticator from '../auth';
import Envelope from './envelope';
import remote from '../helpers/remote';

export default class EnvelopeActions {

  static async create(descriptor, body) {

    if(!Authenticator.token) throw new Error('libvf must be authenticated with an access token before you can create an envelope');

    // Generate a document with hash "1" if nothing else is specified as that's almost always the case
    if(!body) { body = { "documents": { "1": { "data": {} } } } }

    let envelope = await remote.call({
      path: `/envelope-descriptors/${descriptor}/envelopes`,
      method: "POST",
      body: body
    });

    return new Envelope(envelope.data.uid.split("/")[2]);

  }

}
