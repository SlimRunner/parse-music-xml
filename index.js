var path = require('path');
var express = require('express');
var app = express();
const OUTPUT_PORT = 8080;

var dir = path.join(__dirname, 'public');
app.use(express.static(dir));

// route to serve website
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(OUTPUT_PORT, () => console.log('listening to port ' + OUTPUT_PORT));
