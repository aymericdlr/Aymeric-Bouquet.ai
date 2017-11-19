let express = require('express');
let path = require('path');
let app = express();
const PORT=process.env.PORT || 4200;
// Define the port to run on
app.set('port', PORT);

app.use(express.static(path.join(__dirname, 'public')));


// Listen for requests
let server = app.listen(PORT, function() {
    let port = server.address().port;
    console.log('The app is running on port' + port);
});



