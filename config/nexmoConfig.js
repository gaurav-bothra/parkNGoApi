let Nexmo = require('nexmo');
require('dotenv/config');
function nexmoCon() {
    let nexmo = new Nexmo({
        apiKey: process.env.NEXMO_APIKEY,
        apiSecret: process.env.NEXMO_APISECRET
      }, {debug: true});
}
module.exports = nexmoCon;