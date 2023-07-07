const { write } = require("../conn");
const { encrypt, decrypt } = require("../utilities/encryption-decryption");

const SQL_CHECK_CLIENT_BY_ID = "select * from client_credentials where client_id = ? and is_deleted = 0  limit 1";
const SQL_CHECK_CLIENT = "select * from client_credentials where is_deleted = 0";
const SQL_INSERT_CLIENT = "insert into client_credentials (service_name, alias, login_url, username, password, notes ) values (?,?,?,?,?,?)";
const SQL_UPDATE_CLIENT = "update client_credentials set  service_name = ?, alias = ?, login_url = ?,  username = ?, password= ?, notes = ?  where client_id = ? limit 1 ";
const SQL_DELETE_CLIENT = "update client_credentials set is_deleted = 1 where client_id = ? limit 1 ";


async function insertClientCredentials(req, res) {
    try {
        let {service_name, alias, login_url, username, password, notes} = req.body;
        password = await encrypt(password)
        await write.query(SQL_INSERT_CLIENT, [service_name, alias, login_url, username, password, notes ]);
        return res.status(200).send({ status: true, message: "Client credentails inserted successfully" });
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function updateClientCredentials(req, res) {
    try {
        let {service_name, alias, login_url, username, password, notes} = req.body
        let clientId = req.params.client_id
        password = await encrypt(password)
        await write.query(SQL_UPDATE_CLIENT, [service_name, alias, login_url, username, password, notes , clientId]);
        return res.status(200).send({ status: true, message: "Client credentails updated successfully" });

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function findAllClientCredentials(req, res) {
    try {
        let [cloud] = await write.query(SQL_CHECK_CLIENT);
        for(let x of cloud){
            x.password = await decrypt(x.password)
         }
        return res.status(200).send({ message: "Client list", data: cloud});
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function clientFindById(req, res) {
    try {
        let [cloud] = await write.query(SQL_CHECK_CLIENT_BY_ID, [req.params.client_id]);
        cloud[0].password = await decrypt(cloud[0].password)
        return res.status(200).send({ status: true, data: cloud });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}


async function DeleteClientCredentails(req, res) {
    try {
        await write.query(SQL_DELETE_CLIENT, [req.params.client_id]);
        return res.status(200).send({ status: true, message: "CLient deleted successfully" });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

module.exports = {
insertClientCredentials,
updateClientCredentials,
findAllClientCredentials,
clientFindById,
DeleteClientCredentails
 
}


