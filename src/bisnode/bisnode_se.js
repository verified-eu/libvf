import remote from '../helpers/remote';

export default class BisnodeSweden {

  /**
   * Get information about a Swedish company
   * 
   * @memberof bisnode.sweden
   * 
   * @param {string} orgNr Organization number to look up 
   * 
   * @returns {json} Company info
   */
  static async getCompanyInfo(orgNr) {

    let res = await remote.call({
        path: `/bisnode/company?regNumber=${orgNr.replace(/\D/g,'')}`,
        method: "GET"
    });
  
    return res.data;

  }

   /**
   * Get information about a Swedish person
   * 
   * @memberof bisnode.sweden
   * 
   * @param {string} ssn SSN to look up 
   * 
   * @returns {json} Person info
   */
  static async getPersonInfo(ssn) {

    let res = await remote.call({
        path: `/bisnode/person?personNumber=${ssn.replace(/\D/g,'')}`,
        method: "GET"
    });
  
    return res.data;

  }


}