const express = require('express');
const router = express.Router();
const ContactModel = require('@jworkman-fs/asl').ContactModel;
const { filterContacts, sortContacts, Pager } = require('@jworkman-fs/asl'); 


router.get('/contacts', (req, res) => {
    try {
        const contacts = ContactModel.getAll();

        // Apply filtering
        const filtered = filterContacts(contacts, req.get('X-Filter-By'), req.get('X-Filter-Value'), req.get('X-Filter-Operator'));

        // Apply sorting
        const sorted = sortContacts(filtered, req.query.sort, req.query.direction);

        // Apply pagination
        const pager = new Pager(sorted, req.query.page, req.query.size);
        // Set headers
        res.set("X-Page-Total", pager.total());
        res.set("X-Page-Next", pager.next());
        res.set("X-Page-Prev", pager.prev());
        res.json(pager.results());
    } catch (e) {
        switch (e.name) {
            case "InvalidContactError":
                return res.status(400).json({ message: e.message });
            case "ContactNotFoundError":
                return res.status(404).json({ message: e.message });
            case "PagerOutOfRangeError":
                return res.status(400).json({ message: e.message });
            case "InvalidEnumError":
                return res.status(400).json({ message: e.message });
            case "PagerLimitExceededError":
                return res.status(400).json({ message: e.message });
            default:
                return res.status(500).json(e);
        }
    }
});


module.exports = router;