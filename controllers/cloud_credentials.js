const { write } = require("../conn");
const { encrypt, decrypt } = require("../utilities/encryption-decryption");

const SQL_CHECK_CLOUD_BY_ID = "select * from cloud_credentials where acc_id = ? and is_deleted = 0  limit 1";
const SQL_CHECK_CLOUD = "select * from Cloud_credentials where is_deleted = 0";
const SQL_INSERT_CLOUD = "insert into Cloud_credentials (acc_number, acc_alias, username, password, secret_key, access_key, client_id ) values (?,?,?,?,?,?,?)";
const SQL_UPDATE_CLOUD = "update Cloud_credentials set  acc_number = ?, acc_alias = ?, username = ?, password= ?, secret_key = ?, access_key = ?, client_id = ?  where acc_id = ? limit 1 ";
const SQL_DELETE_CLOUD = "update Cloud_credentials set is_deleted = 1 where acc_id = ? limit 1 ";


async function insertCloudCredentials(req, res) {
    try {
        let { acc_number, acc_alias, username, password, secret_key, access_key, client_id } = req.body;
        [password, secret_key, access_key] = await Promise.all([encrypt(password), encrypt(secret_key), encrypt(access_key)])
        await write.query(SQL_INSERT_CLOUD, [acc_number, acc_alias, username, password, secret_key, access_key, client_id]);
        return res.status(200).send({ status: true, message: "Cloud credentails inserted successfully" });
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function updateCloudCredentials(req, res) {
    try {
        let { acc_number, acc_alias, username, password, secret_key, access_key, client_id } = req.body
        let CloudId = req.params.acc_id
        [password, secret_key, access_key] = await Promise.all([encrypt(password), encrypt(secret_key), encrypt(access_key)])
        await write.query(SQL_UPDATE_CLOUD, [acc_number, acc_alias, username, password, secret_key, access_key, client_id, CloudId]);
        return res.status(200).send({ status: true, message: "Cloud credentails updated successfully" });

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function findAllCloudCredentials(req, res) {
    try {
        let [cloud] = await write.query(SQL_CHECK_CLOUD);
        for (let x of cloud) {
            [x.password, x.secret_key, x.access_key] = await Promise.all([decrypt(x.password), decrypt(x.secret_key), decrypt(x.access_key)])
        }
        return res.status(200).send({ message: "Cloud list", data: cloud });
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function cloudFindById(req, res) {
    try {
        let [cloud] = await write.query(SQL_CHECK_CLOUD_BY_ID, [req.params.acc_id]);
        [cloud[0].password, cloud[0].secret_key, cloud[0].access_key] = await Promise.all([decrypt(cloud[0].password), decrypt(cloud[0].secret_key), decrypt(cloud[0].access_key)])
        return res.status(200).send({ status: true, data: cloud });
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}


async function DeleteCloudCredentails(req, res) {
    try {
        await write.query(SQL_DELETE_CLOUD, [req.params.acc_id]);
        return res.status(200).send({ status: true, message: "CLOUD deleted successfully" });
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
