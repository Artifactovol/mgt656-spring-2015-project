'use strict';

var events = require('../models/events');
var validator = require('validator');

// Date data that would be useful to you
// completing the project These data are not
// used a first.
//
var allowedDateInfo = {
  months: {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  },
  minutes: [0, 30],
  hours: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
  ]
};

/**
 * Controller that renders a list of events in HTML.
 */
function listEvents(request, response) {
  var currentTime = new Date();
  var contextData = {
    'events': events.all,
    'time': currentTime
  };
  response.render('event.html', contextData);
}

/**
 * Controller that renders a page for creating new events.
 */
function newEvent(request, response){
  var contextData = {};
  response.render('create-event.html', contextData);
}

/**
 * Controller to which new events are submitted.
 * Validates the form and adds the new event to
 * our global list of events.
 */
function saveEvent(request, response){
  var contextData = {errors: []};

  if (validator.isLength(request.body.title, 5, 50) === false) {
    contextData.errors.push('Your title should be between 5 and 50 letters.');
  }
  
  if (validator.isLength(request.body.location, 5, 50) === false) {
    contextData.errors.push('Location should be between 5 and 50 letters.');
  }

  if (validator.isURL(request.body.image) === false || (request.body.image.indexOf('.png') === -1 && request.body.image.indexOf('.gif') === -1)) {
    contextData.errors.push('The image URL must begin with http:// or https:// and end with ‘.gif’ or ‘.png’');
  }
  if (validator.isInt(request.body.hour) === false) {
   contextData.errors.push('Hour must be integer.');
  }
  var hour = parseInt(request.body.hour, 10);
  if (hour > 23 || hour < 0) {
   contextData.errors.push('Hour must be from 0 to 23.');
  }
  if (validator.isInt(request.body.minute) === false) {
   contextData.errors.push('Minute must be integer.');
  }
  var minute = parseInt(request.body.minute, 10);
  if (minute !== 0 && minute !== 30) {
   contextData.errors.push('Minute must be from 0 or 30.');
  }
  if (validator.isInt(request.body.day) === false) {
   contextData.errors.push('Day must be integer.');
  }
  var day = parseInt(request.body.day, 10);
  if (day > 31 || day < 1) {
   contextData.errors.push('Day must be from 1 to 31.');
  }
  if (validator.isInt(request.body.month) === false) {
   contextData.errors.push('Month must be integer.');
  }
  var month = parseInt(request.body.month, 10);
  if (month > 11 || month < 0) {
   contextData.errors.push('Month must be from 0 (January) to 11 (December).');
  }
  if (validator.isInt(request.body.year) === false) {
   contextData.errors.push('Year must be integer.');
  }
  var year = parseInt(request.body.year, 10);
  if (year > 2016 || year < 2015) {
   contextData.errors.push('Year must be either 2015 or 2016.');
  }
  //end of new event validations
  if (contextData.errors.length === 0) {
    var newEvent = {
      title: request.body.title,
      location: request.body.location,
      image: request.body.image,
      date: new Date(),
      attending: []
    };
    events.all.push(newEvent);
    response.redirect('/events');
  }else{
    response.render('create-event.html', contextData);
  }
}

function eventDetail (request, response) {
  var ev = events.getById(parseInt(request.params.id));
  if (ev === null) {
    response.status(404).send('No such event');
  }
  response.render('event-detail.html', {event: ev});
}

function rsvp (request, response){
  var ev = events.getById(parseInt(request.params.id));
  if (ev === null) {
    response.status(404).send('No such event');
  }

  if(validator.isEmail(request.body.email)){
    ev.attending.push(request.body.email);
    response.redirect('/events/' + ev.id);
  }else{
    var contextData = {errors: [], event: ev};
    contextData.errors.push('Invalid email');
    response.render('event-detail.html', contextData);    
  }

}

/**
 * Export all our functions (controllers in this case, because they
 * handles requests and render responses).
 */
module.exports = {
  'listEvents': listEvents,
  'eventDetail': eventDetail,
  'newEvent': newEvent,
  'saveEvent': saveEvent,
  'rsvp': rsvp
};