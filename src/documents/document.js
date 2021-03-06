import remote from '../helpers/remote';
import Template from '../templates/template';

/**
 * A Document instance created by {@link Envelope#reflect}
 * @class Document
 * @property {string} id Document id
 * @property {string} envelope_id Envelope id
 * @property {object} data Raw document data from the latest reflection
 * @property {Template} template Template instance if typeof this documents source is "template"
 */
export default class Document {

  constructor(id, envelope_id, data) {

    this.id = id;
    this.envelope_id = envelope_id;
    this.data = data;

    if(this.data.source === "template") {
      this.template = new Template(this.data.template.id, this.envelope_id, this.id, this.data.template);
    }

  }

  /**
   * Makes a raw PUT request to the API on the document
   * @instance
   * @memberof Document
   * @param {object} data The payload to be sent
   */
  async put(data) {

    let res = await remote.call({
      path: `/envelopes/${this.envelope_id}/documents/${this.id}`,
      method: "PUT",
      body: data
    });

  }

  /**
   * Update the documents tags
   * @instance
   * @memberof Document
   * @param {string[]} tags An array of tags
   */
  async setTags(tags) {

    let res = await remote.call({
      path: `/envelopes/${this.envelope_id}/documents/${this.id}`,
      method: "PUT",
      body: {
        tags: tags
      }
    });

  }

  /**
   * Upload the main PDF of a document
   * @instance
   * @memberof Document
   * @param {string} fileName The name of the pdf that will be shown in Verified
   * @param {binary} binary Binary data of the pdf file
   */
  async uploadPDF(fileName, binary) {
    let docFileRes = await remote.call({
      path: `/envelopes/${this.envelope_id}/documents/${this.id}/files`,
      method: "POST",
      body: {
        fileType: "document",
        name: fileName
      }
    });

    let url = docFileRes.data.url;

    let res = await remote.raw({
      url: url,
      method: "PUT",
      headers: {
        "Content-Type": "application/pdf"
      },
      data: binary
    });

  }

  /**
   * Upload an attachment to the document
   * @instance
   * @memberof Document
   * @param {string} fileName The name of the attachment that will be shown in Verified
   * @param {binary} binary Binary data of the attachment file
   */
  async uploadAttachment(fileName, binary) {
    let docFileRes = await remote.call({
      path: `/envelopes/${this.envelope_id}/documents/${this.id}/files`,
      method: "POST",
      body: {
        fileType: "attachment",
        name: fileName
      }
    });

    let url = docFileRes.data.url;

    let res = await remote.raw({
      url: url,
      method: "PUT",
      headers: {
        "Content-Type": "application/pdf"
      },
      data: binary
    });

    return res;

  }

  /**
   * Returns information about the specified file
   * @instance
   * @memberof Document
   * @param {string} fileId The id of the file to get info about
   * 
   * @returns {string} Download url
   */
  async getFile(fileId) {

    let res = await remote.call({
      path: `${this.data.uid}/files/${fileId}`,
      method: "GET"
    });

    return res.data;

  }

  /**
   * Returns a download url for the specified file
   * @instance
   * @memberof Document
   * @param {string} fileId The id of the file to get the download url for
   * 
   * @returns {string} Download url
   */
  async getFileDownloadUrl(fileId) {

    let res = await remote.call({
      path: `${this.data.uid}/files/${fileId}/url?asObject=1`,
      method: "GET"
    });

    return res.data.url;

  }

}
