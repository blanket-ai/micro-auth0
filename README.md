# micro-auth0

Helper to get user using Auth0

## Installation

```bash
npm install --save micro-auth0
```

## Usage

```js
const { send } = require('micro');
const auth0 = require('micro-auth0');

module.exports = async (req,res) => {
  const user = await auth0(req, process.env.AUTH0_DOMAIN);
  if(!user) return send(res,403,{ error: "Forbidden" });
  return {
      date: new Date(),
      user: user
    };
};
```
## changelog

- 0.4.0 refactor to user request library
- 0.3.0 refactor to NOT use the Auth0 library
- 0.2.0 add async-to-gen to support node 6
- 0.1.0 initial version
