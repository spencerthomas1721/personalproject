var express = require('express');
var router = express.Router();
const fs = require('fs');
const SchoolInfo = require('../models/SchoolInfo')

let rawdata = fs.readFileSync('./data.json','utf8');
let database = JSON.parse(rawdata);

let schoolinfo = []

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title:'GroupStudy',schoolname:'',subject:'',si:[]})
});

router.post('/', function(req, res, next) {
  const schoolname = req.body.schoolname
  const subjectname = req.body.subjectname
  console.log(req.body.schoolname)
  console.log(req.body.subjectname)
  const si = new SchoolInfo(schoolname,subjectname)
  database.schoolinfo.push(si)
  fs.writeFileSync('../data.json',JSON.stringify(database,null,' '))
  schoolinfo.push(schoolname)
  res.render('index',
  {title:'GroupStudy',schoolname:schoolname,subjectname:subjectname,si:database.si})
});

module.exports = router;
