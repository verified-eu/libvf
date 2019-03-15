import remote from '../helpers/remote';
import Document from '../documents/document';

/**
 * The envelope instance returned by {@link envelopes.create}
 * @class Envelope
 * @property {string} id The envelope id 
 * @property {object} data The raw envelope data from the last reflection
 * @property {Document[]} documents The envelopes documents
 */
export default class Envelope {

  constructor(id) {
    this.id = id;
    this.data = {};
    this.documents = [];
  }

  /**
   * Fetches the envelope data from API and parses the data, instanciating documents etc
   * @instance
   * @memberof Envelope
   */
  async reflect() {

    let res = await remote.call({
      path: `/envelopes/${this.id}`,
      method: "GET"
    });

    this.data = res.data;

    this.deserialize();

  }

  /**
   * Makes a raw PUT request to the API on the envelope
   * @instance
   * @memberof Envelope
   * @param {object} data The payload to be sent
   */
  async put(data) {

    let res = await remote.call({
      path: `/envelopes/${this.id}`,
      method: "PUT",
      body: data
    });

    return res;

  }

  /**
   * Adds a new recipient to the envelope
   * @instance
   * @memberof Envelope
   * @param {object} recipient The recipient data
   * @param {string} recipient.givenName The recipients first name
   * @param {string} recipient.familyName The recipients last name
   * @param {string} recipient.language The language code. "en_EN", "nb_NO", "sv_SE" etc
   * @param {string} recipient.signingMethod The recipients signing method. "email", "touch-sign", "bankid-no", "bankid-se"
   * @param {string} recipient.email The recipients email address
   * @param {number} recipient.order The recipients order in the envelope process
   * @param {object} recipient.role The role of the recipient
   * @param {string} recipient.role.action The recipients action. "sign", "review", "edit"
   * @param {string} recipient.role.label The recipients label that will appear in the Verified Webapp
   * @param {string} recipient.role.name The role name as described in the envelope descriptor
   */
  async addRecipient(recipient) {

    let res = await remote.call({
      path: `/envelopes/${this.id}/recipients`,
      method: "POST",
      body: recipient
    });

  }

  /**
   * Publish the envelope
   * @instance
   * @memberof Envelope
   */
  async publish() {

    let res = await remote.call({
      path: `/envelopes/${this.id}/publish-status`,
      method: "PUT",
      body: { published: true }
    });

  }

   /**
   * Poll for a sign token
   * @instance
   * @memberof Envelope
   * @param {string} flowId The flow id of the envelope as specified in the descriptor
   * @returns {string} JWT with permissions to sign the documents
   */
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

  /**
   * Get sign link for a recipient
   * @instance
   * @memberof Envelope
   * @param {string} id The id of the recipient
   * @returns {string} Full URL to signpage
   */
  async getSignLink(id) {

    let res = await remote.call({
      path: `/envelopes/${this.id}/jobs/get.sign.link`,
      method: "POST",
      body: {
        recipient: {
          id
        }
      }
    });

    return res.data.getSignLink.recipient[id].url;

  }

  deserialize() {
    this.documents = [];
    for(let document of this.data.documents) {
      this.documents.push(new Document(document.id, this.id, document));
    }
  }

  /**
   * Get the first document in the envelope
   * @instance
   * @memberof Envelope
   * @returns {Document} The first document in the envelope
   */
  firstDocument() {
    if(this.documents.length > 0) {
      return this.documents[0];
    }

    return null;
  }

  /**
   * Get the first template in the first document of the envelope
   * @instance
   * @memberof Envelope
   * @returns {Template} The first template in the first document
   */
  firstTemplate() {
    if(this.documents.length > 0 && this.documents[0].template) {
      return this.documents[0].template;
    }

    return null;
  }

  /**
   * Creates a new document
   * @instance
   * @memberof Envelope
   * @param {object} data The payload to be sent with the request to the API
   * 
   * @return {object} Raw HTTP response form the API
   */
  async createDocument(data) {
    let res = await remote.call({
      path: `/envelopes/${this.id}/documents`,
      method: "POST",
      body: data
    });

    return res;
  }

   /**
   * Poll for bearer token
   * @instance
   * @memberof Envelope
   * @param {string} flowId The flow id of the envelope as specified in the descriptor
   * @returns {string} JWT with permissions to make actions on the envelope
   */
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
