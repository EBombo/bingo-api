const admin = require("firebase-admin");
const configJson = require("./config");
const url = require("url");
const serviceAccountEventsDev = require("./bingo-dev-322514-firebase-adminsdk-hezyq-7310fa3331.json");

const config =
    process.env.NODE_ENV === "production"
        ? configJson.production
        : configJson.development;

process.env.NODE_ENV === "production"
    ? admin.initializeApp()
    : admin.initializeApp({
      credential: admin.credential.cert(serviceAccountEventsDev),
      databaseURL: config.firebase.databaseURL,
    });

const adminFirestore = admin.firestore;
const firestore = admin.firestore();
const auth = admin.auth();
const currentEnvironment = process.env.NODE_ENV;
const version = "0.0.1";

try {
  firestore.settings({ ignoreUndefinedProperties: true });
} catch (error) {
  console.error("ignoreUndefinedProperties", error);
}

const hostname = (req) => url.parse(req.headers.origin).hostname;

module.exports = {
  adminFirestore,
  currentEnvironment,
  firestore,
  hostname,
  auth,
  config,
  version,
};
