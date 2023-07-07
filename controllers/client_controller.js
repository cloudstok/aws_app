const { collapseTextChangeRangesAcrossMultipleVersions } = require("typescript");
const { write } = require("../conn");

const SQL_CHECK_CLIENT_BY_ID = "select * from client where client_id = ? and is_deleted = 0 limit 1";
const SQL_ALL_CLIENT = "select * from client where  is_deleted = 0"  ;
const SQL_INSERT_CLIENT = "INSERT into client(name, company_name, assign_to, contact_details) values(?,?,?,?)"

async function findClientById(req, res){
    try{
        const [client] = await write.query(SQL_CHECK_CLIENT_BY_ID, [req.params.client_id]);
        return res.status(200).send({ status: true, data: client });
    }
    catch(err){
        return res.status(400).json({ status: false, message: "Something went wrong"})
    }
    }

async function insertClient(req, res){
    try{
        let {name, company_name, assign_to, contact_details}= req.body;
        assign_to = JSON.stringify(assign_to)
        contact_details = JSON.stringify(contact_details)
        await write.query(SQL_INSERT_CLIENT, [name, company_name, assign_to, contact_details]);
        return res.status(200).json({ status: true, message: "Client inserted successfully"})
    }catch(err){
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong"})
    }
}



async function findAllClients(req, res){
        try{
            const [client] = await write.query(SQL_ALL_CLIENT);
            return res.status(200).send({ message: "User list", data: client });
        }
        catch(err){
            return res.status(400).json({ status: false, message: "Something went wrong"})
        }
    }



module.exports = { findAllClients, insertClient,findClientById}