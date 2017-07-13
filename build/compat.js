var url = require('url');
const AuthenticationClient = require('auth0').AuthenticationClient;

module.exports = function createMicroAuth0(options) {
  var auth0 = new AuthenticationClient(options);

  return (req) => __async(function*(){
    const query = url.parse(req.url, true).query || {};
    let token = query.token || "";
    if(req.headers.authorization && req.headers.authorization.match(/bearer /i)){
      token = req.headers.authorization.substr(7);
    }
    try {
      const result = yield auth0.getProfile(token);
      if(result === "Unauthorized") return false;
      return JSON.parse(result);
    } catch(error) {
      return false;
    }
  }())
};

function __async(g){return new Promise(function(s,j){function c(a,x){try{var r=g[x?"throw":"next"](a)}catch(e){j(e);return}r.done?s(r.value):Promise.resolve(r.value).then(c,d)}function d(e){c(e,1)}c()})}
