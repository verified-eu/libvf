import query from 'query-string';
let instance;

export default class Authenticator {

  static getInstance() {
    if(!instance) instance = new Authenticator();
    return instance;
  }

  authenticate(opts) {
    this.token = opts.token;
    this.namespace = opts.namespace;
  }

  parseUrl() {

    if(!location) throw new Error("Location not defined. Could not find URL.");

    const urlParams = query.parse(location.search);

    if(!urlParams.access_token) throw new Error("Could not find the parameter access_token in URL");

    this.token = urlParams.access_token;

    if(urlParams.c) this.namespace = urlParams.c;

  }

}
