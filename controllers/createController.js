'use strict';
const CreateInfo = require( '../models/createInfo' );

// this displays all of the create info
exports.getAllCreateInfo = ( req, res ) => {
  console.log('in getAllCreateInfo')
  CreateInfo.find( {} )
    .exec()
    .then( ( createInfo ) => {
      res.render( 'create', {
        createInfo: createInfo
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'create info promise complete' );
    } );
};

exports.saveCreateInfo = ( req, res ) => {
  console.log("in saveCreateInfo!")
  console.dir(req)
  let newCreateInfo = new CreateInfo( {
    createName: req.body.createName,
    subject: req.body.subject
  } )

  console.log("create info = " + newCreateInfo)

  newCreateInfo.save()
    .then( () => {
      res.redirect( '/create' );
    } )
    .catch( error => {
      res.send( error );
    } );
};
