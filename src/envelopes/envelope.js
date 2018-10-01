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

  async getSignToken() {

    return new Promise((resolve, reject) => {

      if(!this.data.flow) reject("Envelope must be reflected before signtoken can be retrieved. Could not find envelope flow.");

      let self = this;
      const attempts = 10;

      let polling = setInterval(() => {

        remote.call({
          path: `${self.data.flow.id}/jobs/${self.id}`,
          method: "GET"
        })
        .then((res) => {
          if(res.data.signToken && res.data.signToken != "NA") {
            clearInterval(polling);
            resolve(res.data.signToken);
          }
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

}
