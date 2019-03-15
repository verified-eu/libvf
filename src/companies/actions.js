import Authenticator from '../auth';
import remote from '../helpers/remote';

export default class CompanyActions {

  /**
   * Gets company info
   * 
   * @memberof companies
   * 
   * @param {string} id The company id
   * 
   * @return {json} The raw API response for the company
   */
  static async get(id) {

    let res = await remote.call({
      path: `/companies/${id}`,
      method: "GET"
    });

    return res.data;

  }

  /**
   * Gets a list of companies
   * 
   * @memberof companies
   * 
   * @param {number} limit The amount of companies to return
   * 
   * @return {json} An array of companies
   */
  static async getAll(limit) {

    let res = await remote.call({
      path: `/companies?limit=${limit}`,
      method: "GET"
    });

    return res.data;

  }

}
