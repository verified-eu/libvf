import Authenticator from '../auth';
import Envelope from './envelope';
import remote from '../helpers/remote';
import query from 'query-string';

export default class EnvelopeActions {

  /**
   * Creates a new envelope
   * 
   * @memberof envelopes
   * 
   * @param {string} descriptor Envelope descriptor
   * @param {object} [body={}] API request payload
   * 
   * @return {Envelope} 
   */
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

  /**
   * Gets an envelope by its id
   * 
   * @memberof envelopes
   * 
   * @param {string} id Envelope id
   * 
   * @return {Envelope} 
   */
  static async get(id) {

    let envelope = await remote.call({
      path: `/envelopes/${id}`,
      method: "GET"
    });

    let envelopeInstance = new Envelope(envelope.data.uid.split("/")[2]);

    await envelopeInstance.reflect();

    return envelopeInstance;

  }

  /**
   * Gets an envelope from the document_uid URL parameter
   * 
   * @memberof envelopes
   * 
   * @return {Envelope} 
   */
  static async getFromUrl() {

    const urlParams = query.parse(location.search);

    if(!urlParams.document_uid) throw new Error("Could not find the parameter document_uid in URL");

    let envelope_id = urlParams.document_uid.split('/')[2];

    return await this.get(envelope_id);

  }


  /**
   * Creates a new envelope
   * 
   * @memberof envelopes
   * 
   * @return {json} List of envelopes
   */
  static async query() {

    let res = await remote.call({
      path: `/query/envelopes`,
      method: "GET"
    });

    return res.data;

  }


  /**
   * Gets an envelope by its id
   * 
   * @memberof envelopes
   * 
   * @param {string} descriptorId Descriptor id
   * 
   * @return {json} Descriptor data 
   */
  static async getDescriptor(descriptorId) {

    let res = await remote.call({
      path: `/envelope-descriptors/${descriptorId}`,
      method: "GET"
    });

    return res.data;

  }

}
