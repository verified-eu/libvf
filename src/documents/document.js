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

}
