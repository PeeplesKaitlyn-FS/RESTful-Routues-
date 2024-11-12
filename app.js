const express = require('express');
const app = express();
const port = 8080;
const contactRouter = require('./contacts');

app.use('/contacts', contactRouter);

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});