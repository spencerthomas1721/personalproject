'use strict';
const SchoolInfo = require( '../models/schoolInfo' );

// this displays all of the school info
exports.getAllSchoolInfo = ( req, res ) => {
  console.log('in getAllSchoolInfo')
  SchoolInfo.find( {} )
    .exec()
    .then( ( schoolInfo ) => {
      res.render( '', {
        schoolInfo: schoolInfo
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'school info promise complete' );
    } );
};

exports.saveSchoolInfo = ( req, res ) => {
  console.log("in saveSchoolInfo!")
  console.dir(req)
  let newSchoolInfo = new SchoolInfo( {
    schoolName: req.body.schoolName,
    subject: req.body.subject
  } )

  console.log("school info = " + newSchoolInfo)

  newSchoolInfo.save()
    .then( () => {
      res.redirect( '/schoolInfo' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.deleteSchoolInfo = (req, res) => {
  console.log("in deleteSchoolInfo")
  let schoolName = req.body.deleteName
  console.dir(schoolName)
  if (typeof(schoolName)=='string') { //this means they selected one item
      console.log("asdf")
      SchoolInfo.deleteOne({schoolName:schoolName})
           .exec()
           .then(()=>{res.redirect('/')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(schoolName)=='object'){ //this means they selected multiple items
      console.log("jkl;")
      SchoolInfo.deleteMany({schoolName:{$in:schoolName}})
           .exec()
           .then(()=>{
             res.redirect('/')
             console.dir(schoolName)
           })
           .catch((error)=>{res.send(error)})

  } else if (typeof(schoolName)=='undefined'){
      console.log("This is if they didn't select any option")
      res.redirect('/')
  } else {
    console.log("This shouldn't happen!") //fallback; seems like a good practice
    res.send(`unknown schoolName: ${schoolName}`)
  }

};
