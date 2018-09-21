import axios from 'axios'
import Authenticator from '../auth';

exports.call = async (opts) => {

  if(!Authenticator.getInstance().token) throw new Error("libvf must be authenticated with an access token before you can make calls to the api");

  let headers = {};

  headers["authorization"] = "JWT " + Authenticator.getInstance().token;

  if(Authenticator.getInstance().namespace) {
    headers["x-namespace"] = "/companies/" + Authenticator.getInstance().namespace;
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
