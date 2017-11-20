const express = require('express');
const path = require('path');
const app = express();
const PORT=process.env.PORT || 4200;
// Define the port to run on
app.set('port', PORT);

app.use(express.static(path.join(__dirname, 'public')));


// Listen for requests
let server = app.listen(PORT, function() {
    let port = server.address().port;
    console.log('The app is running on port' + port);
});



