//Import packages
const mongoose = require('mongoose');
const express = require("express");
const morgan = require("morgan");
const ejs = require("ejs");

//models
const Doctor = require('./models/doctor');
const Patient = require('./models/patient');


//Configure Express
const app = express();
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(express.static("css"));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("common"));
app.listen(8080);

// Connection URL
const url = "mongodb://localhost:27017/Lab6";
//reference to the database (i.e. collection)
let db;
//Connect to server
mongoose.connect(url, function (err) {
    if (err) {
        console.log('Error in Mongoose connection : Doctors Database');
        throw err;
    }

    console.log('Successfully connected: Doctor Database');
});

//Home - index.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

/*Doctor*/

//add Doctor
app.get("/addDoctor",function(req,res){
    res.sendFile(__dirname + "/views/addDoctor.html");
});

// handler - addnewDoctor
app.post("/addnewDoctor", function (req, res) {
  let doctorRecords = req.body;
  let doctor = new Doctor({
      //_id: new mongoose.Types.ObjectId(),
      name:{
          firstName:doctorRecords.firstName,
          lastName:doctorRecords.lastName
      },
      date: doctorRecords.dob,
      address: {
          state:doctorRecords.state,
          suburb:doctorRecords.suburb,
          street:doctorRecords.street,
          unit:doctorRecords.unit
      },
      numPatient: doctorRecords.numPatient
  });

  doctor.save(function(err){
      if(err){
        res.redirect("/404");
      }else{
        console.log("success to save new Doctor1")
        res.redirect("/getDoctors"); // redirect the client to list books page -- not sure
      };
  });
});

//List all doctors
app.get("/getDoctors", function (req, res) {
  Doctor.find({},function(err,docs){
      res.render("listDoctors", { doctorDB: docs });
  });
});

//extra task
app.get("/getDoctors-extra", function (req, res) {
    Doctor.find({numPatient:{$lte:5}},function(err,docs){
        res.render("listDoctors", { doctorDB: docs });
    });
  });

//Update doctor:
app.get("/updateDoctor", function (req, res) {
  res.sendFile(__dirname + "/views/updateDoctor.html");
});

//POST request: receive the details from the client and do the update
app.post("/updateDoctorNumP", function (req, res) {
  let doctorData = req.body;
  Doctor.updateOne({'_id':doctorData.doctorID},
  {runValidators:true},
  {$set: {'numPatient': doctorData.numPatient}},
  function(err,doc){
      if(err){
        console.log(doc);
        res.redirect("/invalid");
      }else{
        res.redirect("/getDoctors");// redirect the client to list books page
      }
  });
});

/*Patient */
//add Patient
app.get("/addPatient",function(req,res){
    res.sendFile(__dirname + "/views/addPatient.html");
});

// handler - addNewPatient
app.post("/addnewPatient", function (req, res) {
  let patientRecord = req.body;
  let patient = new Patient({
      fullName:patientRecord.fullName,
      doctorID:patientRecord.doctorID,
      age:patientRecord.age,
      dateVisit:patientRecord.dateVisit,
      description:patientRecord.description
  });

  patient.save(function(err){
      if(err){
        res.redirect("/invalid");
      }else{
        console.log("success to save new Patient")
        res.redirect("/getPatients"); // redirect the client to list books page -- not sure
      }
  });
});

//List all patient
app.get("/getPatients", function (req, res) {
  Patient.find({}).populate('doctorID').exec(function(err,docs){
      if(err){
        console.log(err);
        res.redirect("/invalid");
      }else{
        res.render("listPatients", { patientDB: docs});
      }
  });
});

//Delete patient:
app.get("/deletePatient", function (req, res) {
  res.sendFile(__dirname + "/views/deletePatient.html");
});
app.post("/deletePatientFullname", function (req, res) {
  let patientRecord = req.body;
  Patient.deleteOne({'fullName':patientRecord.fullName},function(err,doc){
      if(err){
          res.redirect("/invalid");
      }else{
          res.redirect("/getPatients");
      }
  })
});

app.post("/deletebookRecordByDate", function (req, res) {
    let bookRecords = req.body;
    let filter = { dateOfpublication: {$lt: bookRecords.dateOfpublication} };
    db.collection("books").deleteMany(filter);
    res.redirect("/getbooks"); // redirect the client to list books page
  });

  app.get("/invalid",function(req,res){
    res.sendFile(__dirname + "/views/404.html");
})

app.get("*",function(req,res){
    res.sendFile(__dirname + "/views/404.html");
})


