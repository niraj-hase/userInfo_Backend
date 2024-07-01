const express = require('express');
const port = 8000;
const app = express();
const db = require('./config/mongoose');
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/',require('./routes'));

app.listen(port ,(err)=>{ 
     if(err){
         console.log("Error in running server");
     }
     console.log(`Server running on ::${port}`);
});

