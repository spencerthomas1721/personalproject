'use strict'
const mongoose = require( 'mongoose' )

var createInfoSchema = mongoose.Schema( {
  schoolName: String,
  subject: String,
  text: String
})

module.exports = mongoose.model( 'createInfo', createInfoSchema )
