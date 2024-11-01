// /backend/routes/auth.js
const express = require("express");
const { createNewUser, loginUser } = require("../controllers/userManagement");
const router = express.Router();

router.post('/register',createNewUser);
router.post('/login',loginUser)

module.exports = router;
