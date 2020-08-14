const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

if (process.env.NODE_ENV !== 'production') const VARS = require('dotenv').config().parsed;

const stripe = require('stripe')(process.env.STRIPE_SECRET);

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors());

if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'client/build')));

    app.get('*', function(req, res){
        res.sendFile(path.join(__dirname,'client/build', 'index.html'))
    });
}

app.post('/payment',(req, res)=>{
    const body = {
        source: req.body.token.id,
        amount: req.body.amount,
        currency: 'eur'
    };

    stripe.charges.create(body, (err, resS)=>{
        if(err){
            console.error(err);
            res.status(500).send({error: err});
        }else{
            res.status(200).send({success: resS});
        }
    })
})

app.listen(port, err =>{
    if(err){
        console.error(err);
    }
    console.info('Server running on '+ port);
})