var url = require("url");
var request = require('request');
const { store, retrieve } = require('./cache')

module.exports = (req,domain) => new Promise((resolve,reject) => {
    const query = url.parse(req.url || "", true).query || {};
    let token = query.token || "";
    if(req.headers.authorization && req.headers.authorization.match(/bearer /i)) {
        token = req.headers.authorization.substr(7);
    }
    if(!token) {
        const error = new Error("No token");
        error.statusCode = 401;
        reject(error);
        return;
    }
    retrieve({domain, token}).then(result => {
      if (result) {
        resolve(result)
      } else {
        request({
            url: `https://${domain}/userinfo`,
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        }, (err, res, result) => {
            if (err) {
                err.statusCode = 500;
                reject(err)
            } else if(result === "Unauthorized") {
                const error = new Error("Token invalid");
                error.statusCode = 403;
                reject(error);
            } else if(res.statusCode !== 200) {
                const error = new Error("Auth0 statusCode "+res.statusCode);
                error.statusCode = 500;
                reject(error);
            } else {
                store({domain, token, result}).then(res => resolve(JSON.parse(result))).catch(err => reject(err))
            }
        });
      }
    }).catch(err => {
      reject(err)
    })
});
