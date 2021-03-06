import remote from '../helpers/remote';
import qs from 'query-string';
import jwt from 'jwt-decode';

export default class OIDCNorway {

  /**
   * Returns a URL in which to redirect the user to
   * 
   * @memberof oidc.norway
   * 
   * @param {string} redirect 
   * 
   * @returns {json} Json object with a url key, with the actual url as value
   */
  static async getAuthUrl(redirect) {

    let redirectPath = redirect || window.location.pathname;

    let res = await remote.call({
        path: `/bankid-oidc/authentication?redirect_path=${redirectPath}`,
        method: "GET"
    });
  
    return res.data.url;

  }

  /**
   * Checks if the browser URL contains id_token and access_token parameters
   * 
   * @memberof oidc.norway
   *
   * @returns {boolean}
   */
  static urlHasNecessaryTokens() {

    let index = window.location.href.indexOf('#');
    let url = window.location.href.substr(0, index) + '?' + window.location.href.substr(index + 1);

    let parsed = qs.parse(url);

    if(parsed.access_token && parsed.id_token)
        return true;

    return false;

  }

  /**
   * Get AML data
   * 
   * @memberof oidc.norway
   * 
   * @param {object} [opts={}] Options
   * @param {string} [opts.id_token=id_token from url] BankID id_token
   * @param {string} [opts.access_token=access_token from url] BankID access_token
   * 
   * @returns {json} Raw AML API response from BankID
   * 
   */
  static async getAmlData(opts) {

    if(!opts) opts = {};

    let index = window.location.href.indexOf('#');
    let url = window.location.href.substr(0, index) + '?' + window.location.href.substr(index + 1);

    let parsed = qs.parse(url);

    let res = await remote.call({
        path: `/bankid-oidc/aml`,
        method: "GET",
        headers: {
            id_token: opts.id_token || parsed.id_token,
            access_token: opts.access_token || parsed.access_token
        }
    });

    return res.data;

  }

  /**
   * Get company info
   * 
   * @memberof oidc.norway
   * 
   * @param {string} orgNr Organization number
   * @param {Array.<string>} [expnds=[]] Expands https://aml.bankidapis.no/#operation/Organization_RetrieveOrganizationInformation
   * @param {string} [nationality=NO] Nationality
   * 
   * @returns {json} Information about the company from BankID
   * 
   */
  static async getCompanyInfo(orgNr, expands, nationality) {

    if(!expands)
      expands = [];

    if(!nationality)
      nationality = "NO";

    let res = await remote.call({
        path: `/bankid-oidc/organization/noauth?organizationNumber=${orgNr.toString().replace(/\D/g,'')}&nationality=${nationality}&expands=${expands.toString()}`,
        method: "GET"
    });

    return res.data;

  }


  /**
   * Decodes and returns the id_token and access_token parameter from the Url
   * @memberof oidc.norway
   * @returns {json} id_token and access_token object
   */
  static decodeUrlTokens() {

    if(!this.urlHasNecessaryTokens())
      throw Error("id_token and access_token not present in Url");
    
    let index = window.location.href.indexOf('#');
    let url = window.location.href.substr(0, index) + '?' + window.location.href.substr(index + 1);

    let parsed = qs.parse(url);

    return {
      id_token: jwt(parsed.id_token),
      access_token: jwt(parsed.access_token)
    }

  }

}