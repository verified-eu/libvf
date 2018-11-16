import Authenticator from '../auth';
import remote from '../helpers/remote';

export default class CompanyActions {

  static async get(id) {

    let res = await remote.call({
      path: `/companies/${id}`,
      method: "GET"
    });

    return res.data;

  }

  static async getAll(limit) {

    let res = await remote.call({
      path: `/companies?limit=${limit}`,
      method: "GET"
    });

    return res.data;

  }

}
