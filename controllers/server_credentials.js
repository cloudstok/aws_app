const { write } = require("../conn");
const { encrypt, decrypt } = require("../utilities/encryption-decryption");

const SQL_CHECK_SERVER_BY_ID = "select * from server_credentials where cloud_credentials = ? and is_deleted = 0  limit 1";
const SQL_CHECK_SERVER = "select * from server_credentials where is_deleted = 0";
const SQL_INSERT_SERVER = "insert into server_credentials(server_name, ip_address, pem_file, username, password, notes,cloud_credentials) values (?,?,?,?,?,?,?)";
const SQL_UPDATE_SERVER = "update server_credentials set server_name= ?, ip_address = ?, pem_file = ?, username = ?, password= ?, notes = ?  where server_id = ? limit 1 ";
const SQL_DELETE_SERVER = "update server_credentials set is_deleted = 1 where server_id = ? limit 1 ";

const SQL_CHECK_CLOUD = "select * from Cloud_credentials where is_deleted = 0";



async function insertServerCredentials(req, res) {
    try {
        let {
            server_name, ip_address, pem_file, username, password, notes,cloud_credentials
        } = req.body;
        pem_file.value = (await encrypt(pem_file.value)).trim()
        pem_file = JSON.stringify(pem_file)
        password = await encrypt(password)
        await write.query(SQL_INSERT_SERVER, [server_name, ip_address, pem_file, username, password, notes,cloud_credentials]);
        return res.status(200).send({ status: true, message: "Server credentails inserted successfully" });
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function updateServerCredentials(req, res) {
    try {
        let { server_name, ip_address, pem_file, username, password, notes } = req.body
        let serverID = req.params.server_id;
        password = await encrypt(password)
        pem_file.value = (await encrypt(pem_file.value)).trim()
        pem_file = JSON.stringify(pem_file)

        await write.query(SQL_UPDATE_SERVER, [server_name, ip_address, pem_file, username, password, notes, serverID]);
        return res.status(200).send({ status: true, message: "Server credentails updated successfully" });

    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function findAllCredentials(req, res) {
    try {
        const [server] = await write.query(SQL_CHECK_SERVER);
        for(let x of server){
            x.password = await decrypt(x.password)
            x.pem_file.value = await decrypt(x.pem_file.value)
        }
        return res.status(200).send({ message: "User list", data: server });
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function serverFindById(req, res) {
    try {
         const [cloud] = await write.query(SQL_CHECK_CLOUD)
         for(let x of cloud){
             const [server] = await write.query(SQL_CHECK_SERVER_BY_ID, [x.acc_id]);
             if(server.length > 0){
             for(let y of server){
                 y.password = await decrypt(y.password)
                 y.pem_file.value = await decrypt(y.pem_file.value)
             }
                 x.serverCredentails = server
             }
         }
        return res.status(200).send({ status: true, data: cloud });
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function DeleteServerCredentails(req, res) {
    try {
        await write.query(SQL_DELETE_SERVER, [req.params.server_id]);
        return res.status(200).send({ status: true, message: "Server deleted successfully" });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}


module.exports = {
 insertServerCredentials, findAllCredentials, serverFindById, DeleteServerCredentails, updateServerCredentials
}
