//Create by Geoffrey Cheung 2015

module.exports = {
  //Set your sever info in here//
  ip : process.env.IP || process.env.INADDR_ANY,
  port : process.env.PORT || 8080,
  //////////////////////////////

  //Set your database in here//
  db_host : process.env.MONGODB_ADDON_HOST || '127.0.0.1',
  db_port : process.env.MONGODB_ADDON_PORT || 27017,
  db_user : process.env.MONGODB_ADDON_USER || '',
  db_pwd : process.env.MONGODB_ADDON_PASSWORD || '',
  db_db : process.env.MONGODB_ADDON_DB || 'myweb',
  ////////////////////////////

  getMongodbURI: function () {
      if(this.db_user != '' && this.db_pwd != '') {
          return "mongodb://"+this.db_user+':'+this.db_pwd+'@'+this.db_host+':'+this.db_port+'/'+this.db_db;
      } else {
          return "mongodb://"+this.db_host+':'+this.db_port+'/'+this.db_db;
      }
  }
};
