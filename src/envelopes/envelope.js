import remote from '../helpers/remote';
import Document from '../documents/document';

export default class Envelope {

  constructor(id) {

    this.id = id;
    this.data = {};
    this.documents = [];

  }

  // Updates this instance to reflect the remote envelope
  async reflect() {

    let res = await remote.call({
      path: `/envelopes/${this.id}`,
      method: "GET"
    });

    this.data = res.data;

    this.deserialize();

  }

  async put(data) {

    let res = await remote.call({
      path: `/envelopes/${this.id}`,
      method: "PUT",
      body: data
    });

    return res;

  }

  async addRecipient(recipient) {

    let res = await remote.call({
      path: `/envelopes/${this.id}/recipients`,
      method: "POST",
      body: recipient
    });

    return res;

  }

  async publish() {

    let res = await remote.call({
      path: `/envelopes/${this.id}/publish-status`,
      method: "PUT",
      body: { published: true }
    });

    return res;

  }

  async getSignToken(flowId) {

    return new Promise((resolve, reject) => {

      let self = this;
      const attempts = 10;

      let pollForSignToken = setInterval(() => {

        remote.call({
          path: `${flowId}/jobs/${self.id}`,
          method: "GET"
        })
        .then((res) => {
          if(res.data.signToken && res.data.signToken != "NA") {
            clearInterval(pollForSignToken);
            resolve(res.data.signToken);
          }
        })
        .catch((err) => {
          clearInterval(pollForSignToken);
          console.log(err);
        });

      }, 1000);

    });

  }

  deserialize() {
    this.documents = [];
    for(let document of this.data.documents) {
      this.documents.push(new Document(document.id, this.id, document));
    }
  }

  firstDocument() {
    if(this.documents.length > 0) {
      return this.documents[0];
    }

    return null;
  }

  firstTemplate() {
    if(this.documents.length > 0 && this.documents[0].template) {
      return this.documents[0].template;
    }

    return null;
  }

  async createDocument(data) {
    let res = await remote.call({
      path: `/envelopes/${this.id}/documents`,
      method: "POST",
      body: data
    });

    return res;
  }

  async getBearerToken(flowId) {

    return new Promise((resolve, reject) => {

      let self = this;
      const attempts = 10;

      let pollForBearerToken = setInterval(() => {

        remote.call({
          path: `${flowId}/jobs/${self.id}`,
          method: "GET"
        })
        .then((res) => {
          if(res.data.token && res.data.token != "NA") {
            clearInterval(pollForBearerToken);
            resolve(res.data.token);
          }
        })
        .catch((err) => {
          clearInterval(pollForBearerToken);
          console.log(err);
        });

      }, 1000);

    });

  }

}
