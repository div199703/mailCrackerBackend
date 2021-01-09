const prodKeys = require("./keys.prod");
process.env.NODE_ENV = "production";

// const devKeys = require("./keys.dev");
// process.env.NODE_ENV = "development";

if (process.env.NODE_ENV === "production") {
    module.exports = prodKeys;
} else {
    module.exports = devKeys;
}

// test