const express = require('express');
const app = express();
const pug = require('pug');
const cors = require('cors');

const port = 3000;

app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(cors());

//index
app.get('/', (req,res)=>{
    res.render('index');
});
app.get('/bracket/?', (req,res)=>{

});

console.log('Bracket Viewer listening on Port %d', port);
app.listen(port);