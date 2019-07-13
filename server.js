var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var server = app.listen(port);

app.use(express.static('public'));
console.log('Server started on Port: ' + port);