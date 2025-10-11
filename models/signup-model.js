const pool = require("../database/")
const { checkExistingClassification } = require("./inventory-model")

/* ***************************
 *  Get all emails in the signup list
 * ************************** */

async function getEmailList(){
    const result = await pool.query("SELECT * FROM public.signup")
    return result.rows
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(signup_email){
    try {
        const sql = "SELECT * FROM signup WHERE signup_email = $1"
        const email = await pool.query(sql, [signup_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   Add new eamil
* *************************** */
async function addNewEmail(signup_email) {
    try {
        const sql = "INSERT INTO signup (signup_email) VALUES ($1)"
        await pool.query(sql,[signup_email])
        return true
    } catch (error) {
        console.error("Error adding email:", error)
        return false
    }
}


module.exports = { getEmailList, checkExistingEmail, addNewEmail }