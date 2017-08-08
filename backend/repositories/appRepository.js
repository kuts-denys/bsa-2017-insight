var mongoose = require('mongoose');
var connection = require('../db/dbconnect');
var Repository = require('./generalRepository');
var App = require('../schemas/appSchema');

function AppRepository() {
	Repository.prototype.constructor.call(this);
	this.model = App;
}

AppRepository.prototype = new Repository();

module.exports = new AppRepository();
