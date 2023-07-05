const { write } = require("../conn");

const SQL_CHECK_MISC_BY_ID = "select * from misc_credentials where misc_id = ? and is_deleted = 0  limit 1";
const SQL_CHECK_MISC = "select * from misc_credentials where is_deleted = 0";
const SQL_INSERT_MISC = "insert into misc_credentials(service_name, alias, login_url, username, password, notes ) values (?,?,?,?,?,?)";
const SQL_UPDATE_MISC = "update misc_credentials set service_name= ?, alias = ?, login_url = ?, username = ?, password= ?, notes = ?  where misc_id = ? limit 1 ";
const SQL_DELETE_MISC = "update misc_credentials set is_deleted = 1 where misc_id = ? limit 1 ";



async function findAllMiscCredentials(req, res) {
    try {
        const [misc] = await write.query(SQL_CHECK_MISC);
        return res.status(200).send({ message: "Misc list", data: misc });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function insertMiscCredentials(req, res) {
    try {
        const {
            service_name, alias, login_url, username, password, notes 
        } = req.body;
        await write.query(SQL_INSERT_MISC, [service_name, alias, login_url, username, password, notes ]);
        return res.status(200).send({ status: true, message: "Misc credentails inserted successfully" });
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function updateMiscCredentials(req, res) {
    try {
        const { service_name, alias, login_url, username, password, notes } = req.body
        let miscId = req.params.misc_id
        await write.query(SQL_UPDATE_MISC, [service_name, alias, login_url, username, password, notes , miscId]);
        return res.status(200).send({ status: true, message: "Misc credentails updated successfully" });

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function DeleteMiscCredentails(req, res) {
    try {
        await write.query(SQL_DELETE_MISC, [req.params.misc_id]);
        return res.status(200).send({ status: true, message: "Misc deleted succesfully" });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}
async function miscFindById(req, res) {
    try {
        const [misc] = await write.query(SQL_CHECK_MISC_BY_ID, [req.params.misc_id]);
        return res.status(200).send({ status: true, data: misc });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

module.exports = {
 findAllMiscCredentials, updateMiscCredentials, DeleteMiscCredentails, miscFindById, insertMiscCredentials
}
