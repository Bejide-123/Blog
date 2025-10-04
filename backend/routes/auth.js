const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt' );
const jwt = require('jsonwebtoken');


router.post('/register', async(req, res) => {
    //user registeration
});

router.post('/login', async(req, res) => {
    //user login
});

module.exports = router;