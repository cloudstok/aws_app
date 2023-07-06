const { write } = require("../conn");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { encrypt, decrypt } = require("../utilities/encryption-decryption");

 const SQL_CHECK_USER_BY_ID = "select * from profile where id = ? and is_deleted = 0  limit 1";
 const SQL_CHECK_USER = "select * from profile where user_id = ?  and is_deleted = 0 limit 1";
 const SQL_INSERT_USER = "insert into profile(user_id, password,name) values (?,?,?)";
 const SQL_ALL_USER = "select * from profile where is_deleted = 0";
 const SQL_UPDATE_USER = "update profile set name= ? where id = ? limit 1 ";
 const SQL_DELETE_USER = "update profile set is_deleted = 1 where id = ? limit 1 ";


 async function register(req, res) {
    try {
        const { user_id, password, name } = req.body
        const [user] = await write.query(SQL_CHECK_USER, [user_id]);
        if (user.length > 0) {
            return res.status(400).json({ status: false, message: "User already exists"})
        }
        const hash = await bcrypt.hash(password, 12)
        await write.query(SQL_INSERT_USER, [user_id, hash, name]);
        return res.status(200).json({ status: true, message: "User registered successfully"})
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ status: false, message: "Something went wrong"})
    }

}

async function login(req, res) {
    try {
        const { user_id, password } = req.body
        const [user] = await write.query(SQL_CHECK_USER, [user_id]);
        if (user.length === 0) {
            return res.status(400).json({ status: false, message: "User not registered"})
        }
        const comparePassword = await bcrypt.compare(password , user[0].password)
        if (!comparePassword) {
            return res.status(400).json({ status: false, message: "Invalid Password"})
        }
        const token = await jwt.sign(user[0] , process.env.JWT_SECRET, {expiresIn: "1h"});
        return res.status(200).send({ message: "Login Successfully", token: token, user : user[0] });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: "Something went wrong"})
    }
}
async function findAllUsers(req, res){
try{
    const [user] = await write.query(SQL_ALL_USER);
    return res.status(200).send({ message: "User list", data: user });
}
catch(err){
    return res.status(400).json({ status: false, message: "Something went wrong"})
}
}

async function updateUser(req, res){
try{
    const {name} = req.body
    const [user] = await write.query(SQL_UPDATE_USER, [name,req.params.id]);
    return res.status(200).send({ status: true, message: "User Update succesfully"});
}
catch(err){
    console.log(err)
    return res.status(400).json({ status: false, message: "Something went wrong"})
}
}
async function DeleteUser(req, res){
try{
    const [user] = await write.query(SQL_DELETE_USER, [req.params.id]);
    return res.status(200).send({ status: true, message: "User deleted succesfully"});
}
catch(err){
    return res.status(400).json({ status: false, message: "Something went wrong"})
}
}
async function findById(req, res){
try{
    const [user] = await write.query(SQL_CHECK_USER_BY_ID, [req.params.id]);
    return res.status(200).send({ status: true, data: user });
}
catch(err){
    return res.status(400).json({ status: false, message: "Something went wrong"})
}
}

module.exports= {
    register, login, findAllUsers, findById, DeleteUser, updateUser
}
