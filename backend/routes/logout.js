const express = require('express');
const router = express.Router();

router.post('/', function(req, res, next){
    res.clearCookie('nToken');
    res.redirect("/");
    return res.status(200);
})

module.exports = router;