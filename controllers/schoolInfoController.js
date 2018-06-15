'use strict';
const SchoolInfo = require( '../models/schoolInfo' );

// this displays all of the school info
exports.getAllSchoolInfo = ( req, res ) => {
  console.log('in getAllSchoolInfo')
  SchoolInfo.find( {} )
    .exec()
    .then( ( schoolInfo ) => {
      res.render( 'schoolInfo', {
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
    name: req.body.name,
    description: req.body.description
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
  let skillName = req.body.deleteName
  if (typeof(schoolName)=='string') { //this means they selected one item
      SchoolInfo.deleteOne({name:skillName})
           .exec()
           .then(()=>{res.redirect('/schoolInfo')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(schoolName)=='object'){ //this means they selected multiple items
      SchoolInfo.deleteMany({name:{$in:schoolName}})
           .exec()
           .then(()=>{res.redirect('/schoolInfo')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(skillName)=='undefined'){
      console.log("This is if they didn't select a skill")
      res.redirect('/schoolInfo')
  } else {
    console.log("This shouldn't happen!") //fallback; seems like a good practice
    res.send(`unknown schoolName: ${schoolName}`)
  }

};
