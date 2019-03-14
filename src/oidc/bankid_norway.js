import remote from '../helpers/remote';
import qs from 'query-string';

export default class OIDCNorway {

  static async getAuthUrl(redirect) {

    let redirectPath = redirect || window.location.pathname;

    let res = await remote.call({
        path: `/bankid-oidc/authentication?redirect_path=${redirectPath}`,
        method: "GET"
    });
  
    return res.data.url;

  }

  static urlHasNecessaryTokens() {

    let index = window.location.href.indexOf('#');
    let url = window.location.href.substr(0, index) + '?' + window.location.href.substr(index + 1);

    let parsed = qs.parse(url);

    if(parsed.access_token && parsed.id_token)
        return true;

    return false;

  }

  static async getAmlData(opts) {

    if(!opts) opts = {};

    let index = window.location.href.indexOf('#');
    let url = window.location.href.substr(0, index) + '?' + window.location.href.substr(index + 1);

    let parsed = qs.parse(url);

    console.log(parsed);

    let res = await remote.call({
        path: `/bankid-oidc/aml`,
        method: "GET",
        headers: {
            id_token: opts.id_token || parsed.id_token,
            access_token: opts.access_token || parsed.access_token
        }
    });

    return res;

  }

}