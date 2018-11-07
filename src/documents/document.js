import remote from '../helpers/remote';
import Template from '../templates/template';

export default class Document {

  constructor(id, envelope_id, data) {

    this.id = id;
    this.envelope_id = envelope_id;
    this.data = data;

    if(this.data.source === "template") {
      this.template = new Template(this.data.template.id, this.envelope_id, this.id, this.data.template);
    }

  }

  async setTags(tags) {

    let res = await remote.call({
      path: `/envelopes/${this.envelope_id}/documents/${this.id}`,
      method: "PUT",
      body: {
        tags: tags
      }
    });

  }

  async uploadPDF(file, binary) {
    let docFileRes = await remote.call({
      path: `/envelopes/${this.envelope_id}/documents/${this.id}/files`,
      method: "POST",
      body: {
        fileType: "document",
        name: file.name
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

  async uploadAttachment(file, binary) {
    let docFileRes = await remote.call({
      path: `/envelopes/${this.envelope_id}/documents/${this.id}/files`,
      method: "POST",
      body: {
        fileType: "attachment",
        name: file.name
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

}
