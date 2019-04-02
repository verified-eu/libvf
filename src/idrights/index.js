import remote from '../helpers/remote';

export default class IDRights {

  /**
   * Get company roles
   * 
   * @memberof idrights
   * 
   * @param {string} orgNr The organization number to look up
   * 
   * @returns {json} companyRoles
   * 
   */
  static async getCompanyRoles(orgNr) {

    let res = await remote.call({
        path: `/id-rights/public/signing-procuration/${orgNr.replace(/\D/g,'')}`,
        method: "GET"
    });
  
    return res.data;

  }

}
