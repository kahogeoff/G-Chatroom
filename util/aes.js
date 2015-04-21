var crypto = require('crypto');
var fs = require('fs');

var security_config = JSON.parse(fs.readFileSync('./config/security_config.json', 'utf8'));
var aes_algorithm = 'aes-256-ctr';
var aes_password = security_config.key;

module.exports = {
	encrypt: function (text){
	  var cipher = crypto.createCipher(aes_algorithm, aes_password)
	  var crypted = cipher.update(text,'utf8','base64')
	  crypted += cipher.final('base64');
	  return crypted;
	},
	 
	decrypt: function (text){
	  var decipher = crypto.createDecipher(aes_algorithm, aes_password)
	  var dec = decipher.update(text,'base64','utf8')
	  dec += decipher.final('utf8');
	  return dec;
	}
};