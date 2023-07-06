const { write } = require("../conn");

const SQL_CHECK_CLIENT_Assign_BY_ID = "select * from client_assignment where assignment_id = ? and is_deleted = 0  limit 1";
const SQL_CHECK_CLIENT_ASSIGN = "select * from client_assignment where is_deleted = 0";
const SQL_INSERT_CLIENT_ASSIGN = "insert into client_assignment (user_id, client_id) values (?,?)";
const SQL_UPDATE_CLIENT_ASSIGN = "update client_assignment set  user_id = ?,client_id = ?  where client_id = ? limit 1 ";
const SQL_DELETE_CLIENT_ASSIGN = "update client_assignment set is_deleted = 1 where assignment_id = ? limit 1 ";


async function insertClientAssignment(req, res) {
    try {
        const {user_id, client_id} = req.body;
        await write.query(SQL_INSERT_CLIENT_ASSIGN, [user_id, client_id]);
        return res.status(200).send({ status: true, message: "Client Assignment inserted successfully" });
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function updateClientAssignment(req, res) {
    try {
        const {user_id, client_id} = req.body
        let clientId = req.params.assignment_id
        await write.query(SQL_UPDATE_CLIENT_ASSIGN, [user_id, client_id, clientId]);
        return res.status(200).send({ status: true, message: "Client Assignment updated successfully" });

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function findAllClientAssignment(req, res) {
    try {
        const [cloud] = await write.query(SQL_CHECK_CLIENT_ASSIGN);
        return res.status(200).send({ message: "Client list", data: cloud});
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

async function clientAssignFindById(req, res) {
    try {
        const [cloud] = await write.query(SQL_CHECK_CLIENT_Assign_BY_ID, [req.params.assignment_id]);
        return res.status(200).send({ status: true, data: cloud });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}


async function DeleteClientAssignment(req, res) {
    try {
        await write.query(SQL_DELETE_CLIENT_ASSIGN, [req.params.assignment_id]);
        return res.status(200).send({ status: true, message: "CLient Assignment deleted successfully" });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong" })
    }
}

module.exports = {
insertClientAssignment,
updateClientAssignment,
findAllClientAssignment,
clientAssignFindById,
DeleteClientAssignment
 
}
