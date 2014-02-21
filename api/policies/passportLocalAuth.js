/**
 * isAuth
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

var passport = require('passport');

module.exports = passport.authenticate('local', {
	successRedirect: '/shoot/',
	failureRedirect: '/user/login' });
