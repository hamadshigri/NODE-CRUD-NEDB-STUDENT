const express = require('express');
const router = express.Router();

const Database = require('nedb');
const students = new Database({filename: 'database/students.db', autoload: true});

// GET all students data from the db
// Endpoint: /api/v2/students

router.get('/', async (req, res) => {
    try {
        await students.find({}).exec((err,data) => {
            if(err) {
                return res.status(500).json({message: "Error in the DB"});
            }
            res.send(data);
        });
    }
    catch {
        res.status(500).json({message: "Error in this API"});
    }
})

// GET one student data by their ID
// Endpoint: /api/v2/students/213243

router.get('/:idVariable', async(req, res) => {
    try {
        await students.findOne({_id: req.params.idVariable}, (err, data) => {
            if(err) {
                res.status(500).json({message: "Error in the DB"});
            }
            if(data != null){
                res.status(200).send(data);
            }
            else {
                res.status(400).json({message: "Student with this ID does not exist"});
            }
        })
    }
    catch {
        res.status(500).json({message: "Error in this API"})
    }
})

// POST students data to the db
// Endpoint: /api/v2/students

router.post('/', async (req, res) => {
    try {
        await students.insert(req.body);
        res.status(200).json({message: "Student Added Successfully"});
    }
    catch {
        res.status(500).json({message: "Error in this API"});
    }
})

// Update students data to the db
// Endpoint: /api/v2/students/id

router.patch('/:idVariable', async(req,res) => {
    try {
        await students.update({_id: req.params.idVariable}, req.body, {upsert: false}, (err, isDataUpdated) => {
            if(err) { 
                return res.status(500).json({message: "Error in the DB"}); 
            }
            // console.log(isDataUpdated);
            if(isDataUpdated){
                res.status(200).json({message: "Student Updated Successfully"});
            }
            else {
                res.status(400).json({message: "Student with this ID does not exist"});
            }

        });
    }
    catch {
        res.status(500).json({message: "Error in this API"});
    }
})


// Delete students By Id in the db
// Endpoint: /api/v2/students/id

router.delete('/:idVariable', async(req,res) => {
    try {
        await students.remove({_id: req.params.idVariable},(err, isDataDeleted) => {
            if(err) { 
                return res.status(500).json({message: "Error in the DB"}); 
            }
            if(isDataDeleted){
                res.status(200).json({message: "Student Deleted Successfully"});
            }
            else {
                res.status(400).json({message: "Student with this ID does not exist"});
            }
        });
    }
    catch {
        res.status(500).json({message: "Error in this API"});
    }
})

module.exports = router;