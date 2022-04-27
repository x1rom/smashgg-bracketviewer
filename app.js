const express = require('express');
const app = express();
const pug = require('pug');


app.set('view engine', 'pug');

const port = 3000;

//index
app.get('/', (req,res)=>{
    res.render('index');
});

console.log('Bracket Viewer listening on Port %d', port);
app.listen(port);