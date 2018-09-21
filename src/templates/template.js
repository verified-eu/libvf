import remote from '../helpers/remote';

export default class Template {

  constructor(id, envelope_id, document_id, data) {

    this.id = id;
    this.envelope_id = envelope_id;
    this.document_id = document_id;
    this.data = data;

  }

  async setUserData(data) {

    let res = await remote.call({
      path: `/envelopes/${this.envelope_id}/documents/${this.document_id}/templates/${this.id}/user-data`,
      method: "POST",
      body: data
    });

    return res;

  }

}
