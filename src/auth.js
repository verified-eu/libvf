import query from 'query-string';

export default class Authenticator {

  static authenticate(opts) {
    Authenticator.token = opts.token;
    Authenticator.namespace = opts.namespace;
  }

  static parseUrl() {

    if(!location) throw new Error("Location not defined. Could not find URL.");

    const urlParams = query.parse(location.search);

    if(!urlParams.access_token) throw new Error("Could not find the parameter access_token in URL");

    this.token = urlParams.access_token;

    if(urlParams.c) this.namespace = urlParams.c;

  }

}
