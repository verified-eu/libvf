import remote from '../helpers/remote';

/**
 * A Template instance created by {@link Envelope#reflect}
 * @class Template
 * @property {string} id Template id
 * @property {string} envelope_id Envelope id
 * @property {string} document_id Document id
 * @property {object} data Raw template data from the latest reflection
 * @property {object} userData userData from the template data
 */
export default class Template {

  constructor(id, envelope_id, document_id, data) {

    this.id = id;
    this.envelope_id = envelope_id;
    this.document_id = document_id;
    this.data = data;
    this.userData = data.userData;

  }

  async setUserData(data) {

    let res = await remote.call({
      path: `/envelopes/${this.envelope_id}/documents/${this.document_id}/templates/${this.id}/user-data`,
      method: "POST",
      body: data
    });

    return res;

  }

  async getUserData() {

    let res = await remote.call({
      path: `/envelopes/${this.envelope_id}/documents/${this.document_id}/templates/${this.id}/user-data`,
      method: "GET"
    });

    return res.data;

  }

}
