const express = require('express');
const app = express();
const port = 3000;
const contactRouter = require('./contacts');

app.use('/api', contactRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});