const express = require('express');
const app = express();
const port = 3000;

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true}));


app.get('/api/v2/test', (req, res) => {
    res.send("NODE CRUD Student System is Running");
} )

// Import students route
const students = require('./students');
app.use('/api/v2/students', students);

//  Start Serving
app.listen(port, () => { console.log('Node Server Started')});

