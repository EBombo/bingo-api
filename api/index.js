const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { getError } = require("./error/getError");
const { postError } = require("./error");
const { getManifest } = require("./manifest/get");
const { getResendVerifyCode } = require("./users/get");
const { getVerifyCode } = require("./users/get");
const { validateRequest } = require("./validateRequest");
const { deleteUser } = require("./users/delete");
const { putUpdateUser } = require("./users/put");
const { postUser } = require("./users/post");
const { validateAdmin } = require("./validateAdmin");
const { getGames } = require("./games/get");
const { postGame } = require("./games/post");
const { putGame } = require("./games/put");
const { postMessage } = require("./messages/post");
const {version} = require("../config");

const api = express();
const router = express.Router();

router.use(cors({ origin: "*" }));

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res) => res.send(`Hello dev ${version}`));

router.post("/users/:userId", validateRequest, postUser);

router.put("/users/:userId/edit", validateAdmin, putUpdateUser);

router.delete("/users/:userId", validateRequest, deleteUser);

router.get(
  "/verify/:userId/verification-code/:verificationCode",
  getVerifyCode
);

router.get("/verify/:userId/resend-code", getResendVerifyCode);

router.get("/manifest", getManifest);

//----------------manage games---------------

router.get("/games/users/:userId", getGames);

router.post("/games/:gameId/users/:userId", postGame);

router.put("/games/:gameId/users/:userId", putGame);

//---------------------message------------------------

router.post("/messages", postMessage);

//---------------------errors------------------------

router.post("/error-boundary", postError);

router.get("/error-vanilla", getError);

api.use("/api", router);

module.exports = { api };
