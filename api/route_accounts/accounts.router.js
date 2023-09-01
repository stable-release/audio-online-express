const router = require("express").Router();
const controller = require("./accounts.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

const corsPOST = cors({methods: "POST"});
const corsPUT = cors({methods: "PUT"});

router.route("/").all(methodNotAllowed);
router.route("/new").post(corsPOST, controller.create).options(corsPOST).all(methodNotAllowed);
router.route("/code").post(corsPOST, controller.updateVerification).options(corsPOST).all(methodNotAllowed);
router.route("/send").put(corsPUT, controller.updateRequestCode).options(corsPUT).all(methodNotAllowed);
router.route("/auth").all(cors()).get(controller.read).all(methodNotAllowed);

module.exports = router;