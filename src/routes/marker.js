var express = require('express');
var router = express.Router();

router.get('/', function (req, res){
  return res.send('-');
});

module.exports = router;
