const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


router.get('/',function(req,res) {
    res.sendFile(path.join(__dirname,'basic.html'));
});
router.get('/form',function(req,res) {
    res.send(req.query);
})

app.use(router);

app.listen(3000,function() {
    console.log('listen 3000!,open http://localhost:3000');
})