'use strict';
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const CourseInfo = require( '../models/courseInfo' );
const rawdata = fs.readFileSync('courseInfo.json');
var course = JSON.parse(rawdata);

exports.renderResults = (req, res, next) => {
  res.render('results')
  next()
}

exports.attachCourseInfo = (req, res, next) => {
  console.log("attaching course data")
  axios.get('http://registrar-prod.unet.brandeis.edu/registrar/schedule/classes/2018/Summer/1400/UGRD')
    .then((response) => {
      console.log("b")
        if(response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);
        var courseInfo = []
        $('tr').each(function(i, elem) {
          console.log("a")
          if($(this).attr("class") == "row" || $(this).attr("class") == "rowFirst" || $(this).attr("class") == "rowOdd") {
            CourseInfo[i] = {
              courseNum: $(this).children('.def').attr('name'),
              courseName: '$(this).find("strong").text()'
            }
          }
        })
        const courseInfoTrimmed = courseInfo.filter(n => n != undefined)
        res.locals.data = courseInfoTrimmed
        next()
        }
    })
    .catch(error => {
      console.log(error)
    })
  }
