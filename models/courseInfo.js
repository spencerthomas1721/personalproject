'use strict'
const mongoose = require('mongoose')
const request = require('request')

var courseInfoSchema = mongoose.Schema( {
  courseNum: String,
  courseName: String
})

module.exports = mongoose.model( 'courseInfo', courseInfoSchema )
