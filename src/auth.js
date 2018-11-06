import query from 'query-string';
import jwt from 'jwt-decode';
import remote from './helpers/remote';
import CompanyActions from './companies/actions';

export default class Authenticator {

  static authenticate(opts) {
    this.token = opts.token;
    this.namespace = opts.namespace;
    this.tokenData = Authenticator.parseToken(opts.token);
  }

  static async login(opts) {

    let res = await remote.auth({
      email: opts.email,
      password: opts.password
    });

    if(res.data && res.data.token) {
      this.token = res.data.token;
      this.tokenData = Authenticator.parseToken(this.token);
      return res.data.token;
    }

    return res.data;

  }

  static async getUserinfo() {

    let res = await remote.call({
      path: `/auth/userinfo`,
      method: "GET"
    });

    return res.data;

  }

  static async getCompanies() {

    let companies = [];

    let res = await remote.call({
      path: `/auth?action=OPTIONS&resource=%2Fcompanies`,
      method: "GET"
    });

    for(let resource of res.data.resources) {

      let company = await CompanyActions.get(resource.split("/companies/")[1]);

      companies.push(company);

    }

    return companies;

  }

  static setNamespace(companyID) {
    this.namespace = companyID;
  }

  static parseUrl() {

    if(!location) throw new Error("Location not defined. Could not find URL.");

    const urlParams = query.parse(location.search);

    if(!urlParams.access_token) throw new Error("Could not find the parameter access_token in URL");

    this.token = urlParams.access_token;
    this.tokenData = this.parseToken(urlParams.access_token);

    if(urlParams.c) this.namespace = "/companies/" + urlParams.c;

  }

  static parseToken(token) {
    let tokenData = jwt(token);
    if(tokenData.roles) {
      for(let role of tokenData.roles) {
        if(role.includes("descriptors")) {
          this.role = /[^/]*$/.exec(role)[0];
        }
      }
    } else {
      this.role = "owner";
    }

    return tokenData;
  }

}
