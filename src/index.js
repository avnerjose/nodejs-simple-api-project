const express = require('express'); //Importing express

const app = express(); //Creating app
const { v4, validate } = require('uuid');//Importing UUID

app.use(express.json());//Configuring express to accept JSON body

const products = [];//Creating static array of products

//Middleware that shows the method and the URL being called
function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next();
}

//Middleware that checks if the ID is a valid UUID 
function validateProductID(request, response, next) {
    const { id } = request.params;

    if (!validate(id)) {
        return response.status(400).json({
            error: "Invalid product ID"
        })
    }

    return next();

}

//Using the middlewares  
app.use(logRequests); 
app.use('/products/:id', validateProductID);

//Get all the products or filter them by name sent via query params
app.get('/products', (request, response) => {
    const { name } = request.query;

    const results = name
        ? products.filter(product => product.name.includes(name))
        : products;

    return response.json(results);
});

//Create a new product 
app.post('/products', (request, response) => {

    const { name, description, price } = request.body;

    const product = { id: v4(), name, description, price }

    products.push(product);

    return response.json(product);

});

//Changes an existing product
app.put('/products/:id', (request, response) => {

    const { id } = request.params;
    const { name, description, price } = request.body;

    const productIndex = products.findIndex(product => product.id === id);
    const product = { id, name, description, price }


    if (productIndex < 0) {

        return response.status(404).json({
            error: "product not found"
        })
    }

    products[productIndex] = product;

    return response.json(product);

});

//Deletes an existing product
app.delete('/products/:id', (request, response) => {

    const { id } = request.params;

    const productIndex = products.findIndex(product => product.id === id); //

    if (productIndex < 0) {
        return response.status(404).json({
            error: "Product not found"
        })
    }

    products.splice(productIndex, 1);

    return response.status(204).send();
});

//Listen to the port 3333 
app.listen(3333, () => {
    console.log("Backend Started")
});

