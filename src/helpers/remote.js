import axios from 'axios'
import Authenticator from '../auth';

export default class Remote {

  static async call(opts) {

    if(!Authenticator.token) throw new Error("libvf must be authenticated with an access token before you can make calls to the api");

    let headers = opts.headers || {};

    headers["authorization"] = "JWT " + Authenticator.token;

    if(Authenticator.namespace) {
      headers["x-namespace"] = Authenticator.namespace;
    }

    headers["content-type"] = "application/json";
    headers["accept"] = "application/json";

    try {
      let res = await axios({
        url: "/api" + opts.path,
        method: opts.method.toUpperCase(),
        headers: headers,
        data: opts.body,
        withCredentials: "same-origin",
        params: opts.params || {}
      });

      return res;
    }
    catch(err) {
      throw new Error(err);
    }

  }

  static async auth(opts) {

    try {
      let res = await axios({
        url: "/api/auth",
        method: "POST",
        auth: {
          username: opts.email,
          password: opts.password
        }
      });

      return res;
    }
    catch(err) {
      throw new Error(err);
    }

  }

  static async raw(opts) {
    try {
      let res = await axios(opts);

      return res;
    }
    catch(err) {
      throw new Error(err);
    }
  }

}
