import query from 'query-string';
import jwt from 'jwt-decode';

export default class Authenticator {

  static authenticate(opts) {
    this.token = opts.token;
    this.namespace = opts.namespace;
    this.tokenData = Authenticator.parseToken(opts.token);
  }

  static parseUrl() {

    if(!location) throw new Error("Location not defined. Could not find URL.");

    const urlParams = query.parse(location.search);

    if(!urlParams.access_token) throw new Error("Could not find the parameter access_token in URL");

    this.token = urlParams.access_token;
    this.tokenData = this.parseToken(urlParams.access_token);

    if(urlParams.c) this.namespace = urlParams.c;

  }

  static parseToken(token) {
    return jwt(token);
  }

}
