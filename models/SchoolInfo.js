'use strict'
const mongoose = require( 'mongoose' );

var schoolInfoSchema = mongoose.Schema( {
  schoolName: String,
  subject: String
} );

module.exports = mongoose.model( 'SchoolInfo', schoolInfoSchema );
