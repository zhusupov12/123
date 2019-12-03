const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { getProduct, getProducts } = require('./items');
const user = require('./models/user');
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.get('/', (req, res) => {
    res.send('Welcome to API page!');
})

app.get('/products/', getProducts);
app.get('/products/:name', getProduct);
app.post('/auth/signup', user.signUp);
app.post('/auth/signin', user.signIn)
app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
})