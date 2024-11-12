const express = require('express');
const app = express();
const port = 3000;
const contactRouter = require('./contacts');

router.get('/contacts', (req, res) => {
    // Handle GET requests to /api/contacts
    res.json({ message: 'Contacts endpoint' });
});

module.exports = router;

app.use('/api', contactRouter);

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});