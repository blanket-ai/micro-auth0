var url = require("url");
var request = require("request");

module.exports = (req,domain) => new Promise((resolve,reject) => {
    const query = url.parse(req.url || "", true).query || {};
    let token = query.token || "";
    if(req.headers.authorization && req.headers.authorization.match(/bearer /i)) {
        token = req.headers.authorization.substr(7);
    }
    request({
        url: `https://${domain}/userinfo`,
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    }, (err, res, result) => {
        if (err || result === "Unauthorized" || res.statusCode !== 200) {
            resolve(false);
        } else {
            resolve(JSON.parse(result));
        }
    });
});
