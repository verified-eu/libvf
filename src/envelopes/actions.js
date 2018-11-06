import Authenticator from '../auth';
import Envelope from './envelope';
import remote from '../helpers/remote';
import query from 'query-string';

export default class EnvelopeActions {

  static async create(descriptor, body) {

    // Generate a document with hash "1" if nothing else is specified as that's almost always the case
    if(!body) { body = { "documents": { "1": { "data": {} } } } }

    let envelope = await remote.call({
      path: `/envelope-descriptors/${descriptor}/envelopes`,
      method: "POST",
      body: body
    });

    return new Envelope(envelope.data.uid.split("/")[2]);

  }

  static async get(id) {

    let envelope = await remote.call({
      path: `/envelopes/${id}`,
      method: "GET"
    });

    let envelopeInstance = new Envelope(envelope.data.uid.split("/")[2]);

    await envelopeInstance.reflect();

    return envelopeInstance;

  }

  static async getFromUrl() {

    const urlParams = query.parse(location.search);

    if(!urlParams.document_uid) throw new Error("Could not find the parameter document_uid in URL");

    let envelope_id = urlParams.document_uid.split('/')[2];

    return await this.get(envelope_id);

  }


  static async query() {

    let res = await remote.call({
      path: `/query/envelopes`,
      method: "GET"
    });

    return res.data;

  }

}
