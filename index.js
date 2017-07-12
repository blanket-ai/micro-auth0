var url = require('url');
const AuthenticationClient = require('auth0').AuthenticationClient;

module.exports = function createMicroAuth0(options) {
  var auth0 = new AuthenticationClient(options);

  return async (req) => {
    const query = url.parse(req.url, true).query || {};
    let token = query.token || "";
    if(req.headers.authorization && req.headers.authorization.match(/bearer /i)){
      token = req.headers.authorization.substr(7);
    }
    try {
      const result = await auth0.getProfile(token);
      if(result === "Unauthorized") return false;
      return JSON.parse(result);
    } catch(error) {
      return false;
    }
  }
};
