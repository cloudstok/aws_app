const express = require('express');
const app = express();
const cors = require('cors')
const route = require('./routes/route')
require('dotenv').config()
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(cors());

app.use(route);



app.listen(PORT, ()=> console.log(`App is listening on PORT ${PORT}`))