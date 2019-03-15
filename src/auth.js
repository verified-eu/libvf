import query from 'query-string';
import jwt from 'jwt-decode';
import remote from './helpers/remote';
import CompanyActions from './companies/actions';

export default class Authenticator {

   /**
   * Manually specify jwt and namespace
   * 
   * @memberof auth
   * 
   * @param {object} opts Options
   * @param {string} opts.token The JWT
   * @param {string} opts.namespace The namespace, e.g "/companies/company_id"
   * 
   */
  static authenticate(opts) {
    this.token = opts.token;
    this.namespace = opts.namespace;
    this.tokenData = Authenticator.parseToken(opts.token);
  }

  /**
   * Authenticate with Verified email and password
   * 
   * @memberof auth
   * 
   * @param {object} opts Options
   * @param {string} opts.email Your Verified email
   * @param {string} opts.password Your Verified password
   * 
   */
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

  /**
   * Gets info about the authenticated user. Calling this method before authenticating will throw an error.
   * 
   * @memberof auth
   * 
   * @return {json} The raw API response for userinfo
   * 
   */
  static async getUserinfo() {

    let res = await remote.call({
      path: `/auth/userinfo`,
      method: "GET"
    });

    return res.data;

  }

    /**
   * Gets the authenticated users companies. Calling this method before authenticating will throw an error.
   * 
   * @memberof auth
   * 
   * @return {array} An array of companies
   * 
   */
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

  /**
   * Sets the namespace of the auth instance
   * 
   * @memberof auth
   * 
   * @param {string} companyID The namespace to set. E.g "/companies/company_id"
   * 
   */
  static setNamespace(companyID) {
    this.namespace = companyID;
  }

  /**
   * Sets the JWT of the auth instance
   * 
   * @memberof auth
   * 
   * @param {string} token The JWT
   * 
   */
  static setToken(token) {
    this.token = token;
    this.tokenData = Authenticator.parseToken(token);
  }

  /**
   * Sets the JWT from one of the two URL parameters "verified_token" or "access_token" (required)
   * Sets the namespace from one of the two URL parameters "c" or "namespace" (optional)
   * 
   * @memberof auth
   * 
   */
  static useTokenFromUrl() {

    if(!location) throw new Error("Location not defined. Could not find URL.");

    const urlParams = query.parse(location.search);

    let token = urlParams.verified_token || urlParams.access_token;

    if(!token) throw new Error("Could not find the parameter verified_token or access_token in URL");

    this.token = token;

    this.tokenData = this.parseToken(token);

    if(urlParams.c) this.namespace = "/companies/" + urlParams.c;
    else if(urlParams.namespace) this.namespace = "/companies/" + urlParams.namespace

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
