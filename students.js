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

// router.get('/:idVariable', async(req, res) => {
//     try {
//         await students.findOne({_id: req.params.idVariable}, (err, data) => {
//             if(err) {
//                 res.status(500).json({message: "Error in the DB"});
//             }
//             if(data != null){
//                 res.status(200).send(data);
//             }
//             else {
//                 res.status(400).json({message: "Student with this ID does not exist"});
//             }
//         })
//     }
//     catch {
//         res.status(500).json({message: "Error in this API"})
//     }
// })

// GET all student from particular city
// Endpoint: /api/v2/students/city/karachi

router.get('/city/:cityVar', async(req, res) => {
    try {
        await students.find({city: req.params.cityVar}, (err, data) => {
            if(err) {
                res.status(500).json({message: "Error in the DB"});
            }
            if((data!= null) && (data.length>0)){
                res.status(200).send(data);
            }
            else {                  //data.length=0
                res.status(400).json({message: "No Students from this city"});
            }
        })
    }
    catch {
        res.status(500).json({message: "Error in this API"})
    }
})

// Assignment Question 1
// GET the average score for all the students
// Endpoint: /api/v2/students/avgScore

// POST students data to the db
// Endpoint: /api/v2/students

router.get('/avgScore', async(req, res) => {
    var x = 0;
    try {
        await students.find({}, (err,data) => {
            data.map((indexVal) => {
                x += indexVal.score;
            })
            res.status(200).json({ "Average Score of the students are " :  x / data.length })
        })
    }
    catch {
        res.status(500).json({message: 'Error in this API'});
    }
})

// Assignment Question 2
// first check if student with this name is already in the database
// If not, Add the student
// If yes, tell frontend that this student name is already exists.

router.post('/name/:name', async(req,res) => {
    try
    { 
      await students.find({name: req.params.name}, (err,data) => {
      if(err)
      {
        res.status(500).json({message:'Server Side Error: ' + Error});
      }
      if(data==false)
      {
        students.insert(req.body)
        res.status(200).json({message: ('Student Added Successfully')});
      }
      else
      {
        res.status(200).json({message: ('Already Exist')});
      }
    })
  }
    catch(Error)
    {
       res.status(500).json({message:'Server Side Error: ' + Error});
    }

  })

  

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


// Delete All students Data from db
// Endpoint: /api/v2/students

router.delete('/', async(req,res) => {
    try {
        await students.remove({}, {multi: true}, (err, isDataDeleted) => {
            if(err) { 
                return res.status(500).json({message: "Error in the DB"}); 
            }
            if(isDataDeleted){
                res.status(200).json({message: "Student Deleted Successfully"});
            }
            else {
                res.status(400).json({message: "No Student Data in the DB"});
            }
        })
        
    }
    catch {
        res.status(500).json({message: "Error in this API"});
    }
})

module.exports = router;