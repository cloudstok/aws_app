const { write } = require("../conn");

const SQL_CHECK_CLOUD_BY_ID = "select * from cloud_credentials where acc_id = ? and is_deleted = 0  limit 1";
const SQL_CHECK_CLOUD = "select * from Cloud_credentials where is_deleted = 0";
const SQL_INSERT_CLOUD = "insert into Cloud_credentials (acc_number, acc_alias, username, password, secret_key, access_key ) values (?,?,?,?,?,?)";
const SQL_UPDATE_CLOUD = "update Cloud_credentials set  acc_number = ?, acc_alias = ?, username = ?, password= ?, secret_key = ?, access_key = ?  where acc_id = ? limit 1 ";
const SQL_DELETE_CLOUD = "update Cloud_credentials set is_deleted = 1 where acc_id = ? limit 1 ";


async function insertCloudCredentials(req, res) {
    try {
        const {acc_number, acc_alias, username, password, secret_key, access_key} = req.body;
        await write.query(SQL_INSERT_CLOUD, [acc_number, acc_alias, username, password, secret_key, access_key ]);
        return res.status(200).send({ status: true, message: "Cloud credentails inserted successfully" });
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function updateCloudCredentials(req, res) {
    try {
        const {acc_number, acc_alias, username, password, secret_key, access_key} = req.body
        let CloudId = req.params.acc_id
        await write.query(SQL_UPDATE_CLOUD, [acc_number, acc_alias, username, password, secret_key, access_key , CloudId]);
        return res.status(200).send({ status: true, message: "Cloud credentails updated successfully" });

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function findAllCloudCredentials(req, res) {
    try {
        const [cloud] = await write.query(SQL_CHECK_CLOUD);
        return res.status(200).send({ message: "Cloud list", data: cloud});
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function cloudFindById(req, res) {
    try {
        const [cloud] = await write.query(SQL_CHECK_CLOUD_BY_ID, [req.params.acc_id]);
        return res.status(200).send({ status: true, data: cloud });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}


async function DeleteCloudCredentails(req, res) {
    try {
        await write.query(SQL_DELETE_CLOUD, [req.params.acc_id]);
        return res.status(200).send({ status: true, message: "CLOUD deleted succesfully" });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

module.exports = {

 insertCloudCredentials,
 findAllCloudCredentials,
 cloudFindById,
 updateCloudCredentials,
 DeleteCloudCredentails
 
}
