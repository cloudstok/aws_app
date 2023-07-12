const { write } = require("../conn");
const { encrypt, decrypt } = require("../utilities/encryption-decryption");

const SQL_CHECK_MISC_BY_ID = "select * from misc_credentials where server_credential = ? and is_deleted = 0 ";
const SQL_CHECK_MISC = "select * from misc_credentials where is_deleted = 0";
const SQL_INSERT_MISC = "insert into misc_credentials(service_name, alias, login_url, username, password, notes  , server_credential) values (?,?,?,?,?,? ,?)";
const SQL_UPDATE_MISC = "update misc_credentials set service_name= ?, alias = ?, login_url = ?, username = ?, password= ?, notes = ?  where misc_id = ? limit 1 ";
const SQL_DELETE_MISC = "update misc_credentials set is_deleted = 1 where misc_id = ? limit 1 ";
const SQL_CHECK_SERVER = "select * from server_credentials where is_deleted = 0 ";




async function insertMiscCredentials(req, res) {
    try {
        let { service_name, alias, login_url, username, password, notes , server_credential} = req.body;
        password = await encrypt(password)
        await write.query(SQL_INSERT_MISC, [service_name, alias, login_url, username, password, notes  , server_credential]);
        return res.status(200).send({ status: true, message: "Misc credentails inserted successfully" });
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function updateMiscCredentials(req, res) {
    try {
        let { service_name, alias, login_url, username, password, notes } = req.body
        let {misc_id} = req.params
        password = await encrypt(password)
        await write.query(SQL_UPDATE_MISC, [service_name, alias, login_url, username, password, notes , misc_id]);
        return res.status(200).send({ status: true, message: "Misc credentails updated successfully" });

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function findAllMiscCredentials(req, res) {
    try {
        let  [misc] = await write.query(SQL_CHECK_MISC);
        for(let x of misc){
           x.password = await decrypt(x.password)
        }
        return res.status(200).send({ message: "Misc list", data: misc });
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}



async function miscFindById(req, res) {
    try {

        let [server] = await write.query(SQL_CHECK_SERVER);
        for(let x of server){
            let [misc] = await write.query(SQL_CHECK_MISC_BY_ID, [x.server_id]);
            for(let y of misc){
                y.password = await decrypt(y.password)
            }
            x.misc = misc
        }
        return res.status(200).send({ status: true, data: server });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function DeleteMiscCredentails(req, res) {
    try {
        await write.query(SQL_DELETE_MISC, [req.params.misc_id]);
        return res.status(200).send({ status: true, message: "Misc deleted successfully" });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

module.exports = {
 findAllMiscCredentials, updateMiscCredentials, DeleteMiscCredentails, miscFindById, insertMiscCredentials
}
