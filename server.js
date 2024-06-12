const express = require('express');
const{v4:uuidv4} = require("uuid");
const axios = require('axios');
const path = require('path');
const bodypraser = require("body-parser");
const session = require("express-session");

const router = require('./router');

const app = express();


const port = process.env.PORT||3000;

app.use(bodypraser.json())
app.use(bodypraser.urlencoded({extended:true}))


app.set('view engine','ejs');

app.use('/static',express.static(path.join(__dirname,'public')))

app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}));

app.use('/route',router)

app.get('/',function(req,res){
    res.render('base',{title:"Login System"})
});


async function fetchBookDetails(query) {
    try {
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyCt3Wop5gN3S5H0r1CKZlXIgaM908oVDls`;
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching book data:', error);
        return null;
    }
}

app.post('/search', async (req, res) => {
    try {
        const book = await fetchBookDetails(req.body.bookTitle);
        console.log('Book:', book); 
        if (book && book.items && book.items.length > 0) {
            res.render('Details_of_Book', { book: book.items[0].volumeInfo });
        } else {
            res.render('Details_of_Book', { book: null });
        }
    } catch (error) {
        console.error('Error fetching book data:', error);
        res.status(500).send('Error fetching book data');
    }
});


app.listen(port,function(){
    console.log("This program is running on http://localhost:3000")
});
