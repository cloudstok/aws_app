const { insertClientAssignment, findAllClientAssignment, updateClientAssignment, DeleteClientAssignment, clientAssignFindById } = require('../controllers/client_assignment');
const { insertClientCredentials, findAllClientCredentials, clientFindById, updateClientCredentials, DeleteClientCredentails } = require('../controllers/client_credentials');
const { insertCloudCredentials, findAllCloudCredentials, cloudFindById, updateCloudCredentials, DeleteCloudCredentails } = require('../controllers/cloud_credentials');
const { insertMiscCredentials, findAllMiscCredentials, miscFindById, updateMiscCredentials, DeleteMiscCredentails } = require('../controllers/misc_credentials');
const { insertServerCredentials, findAllCredentials, serverFindById, updateServerCredentials, DeleteServerCredentails } = require('../controllers/server_credentials');
const { register, login, findAllUsers, findById, DeleteUser, updateUser } = require('../controllers/user');

const route = require('express').Router();

// User Routes
route.post('/register', register);
route.post('/login', login);
route.get('/getallusers', findAllUsers);
route.get('/getuserbyid/:id', findById);
route.post('/deleteuser/:id', DeleteUser);
route.post('/updateuser/:id', updateUser);



// Server Credentials Routes

route.post('/add/server/credentials', insertServerCredentials);
route.get('/get/server/credentials', findAllCredentials);
route.get('/get/credentialbyid/:server_id', serverFindById);
route.post('/update/serverbyid/:server_id', updateServerCredentials);
route.post('/delete/server/credentials/:server_id', DeleteServerCredentails);

// Misc credentials Routes

route.post('/add/misc/credentials', insertMiscCredentials);
route.get('/get/misc/credentials', findAllMiscCredentials);
route.get('/get/misc/credentialbyid/:misc_id', miscFindById);
route.post('/update/miscbyid/:misc_id', updateMiscCredentials);
route.post('/delete/misc/credentials/:misc_id', DeleteMiscCredentails);

// Cloud Credentials Routes

route.post('/add/cloud/credentials', insertCloudCredentials);
route.get('/get/cloud/credentials', findAllCloudCredentials);
route.get('/get/cloud/credentialbyid/:acc_id', cloudFindById);
route.post('/update/cloudbyid/:acc_id', updateCloudCredentials);
route.post('/delete/cloud/credentials/:acc_id', DeleteCloudCredentails);


// Client Credentials 

route.post('/add/client/credentials', insertClientCredentials);
route.get('/get/client/credentials', findAllClientCredentials);
route.get('/get/client/credentialbyid/:client_id', clientFindById);
route.post('/update/clientbyid/:client_id', updateClientCredentials);
route.post('/delete/client/credentials/:client_id', DeleteClientCredentails);

// CLient Assignment 

route.post('/add/clientAssign/credentials', insertClientAssignment);
route.get('/get/clientAssign/credentials', findAllClientAssignment);
route.get('/get/clientAssign/credentialbyid/:client_id',clientAssignFindById );
route.post('/update/assignclientbyid/:client_id', updateClientAssignment);
route.post('/delete/assignclient/credentials/:client_id', DeleteClientAssignment);



module.exports = route;