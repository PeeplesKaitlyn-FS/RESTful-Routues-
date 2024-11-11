const express = require('express');
const router = express.Router();
const ContactModel = require('@jworkman-fs/asl').ContactModel;
const { filterContacts, sortContacts, Pager } = require('@jworkman-fs/asl'); 

// GET /contacts
router.get('/contacts', async (req, res) => {
    try {
        const contacts = await ContactModel.getAll();
        const filtered = filterContacts(contacts, req.get('X-Filter-By'), req.get('X-Filter-Value'));
        const sorted = sortContacts(filtered, req.query.sort, req.query.direction);
        const pager = new Pager(sorted, req.query.page, req.query.size);
        res.set("X-Page-Total", pager.total());
        res.set("X-Page-Next", pager.next());
        res.set("X-Page-Prev", pager.prev());
        res.json(pager.results());
    } catch (e) {
        const errorHandlers = {
            "InvalidContactError": () => res.status(422).json({ message: "Invalid contact data" }),
            "ContactNotFoundError": () => res.status(404).json({ message: "Contact not found" }),
            "PagerOutOfRangeError": () => res.status(400).json({ message: "Invalid page or size parameter" }),
            "InvalidEnumError": () => res.status(400).json({ message: "Invalid sort or direction parameter" }),
            "PagerLimitExceededError": () => res.status(400).json({ message: "Page size limit exceeded" }),
        };
        const errorHandler = errorHandlers[e.name] || (() => res.status(500).json({ message: "Internal server error" }));
        errorHandler();
    }
});


// GET /contacts/:id
router.get('/contacts/:id', async (req, res) => {
    try {
        const contact = await ContactModel.get(req.params.id);
        if (!contact) {
            throw new Error("Contact not found");
        }
        res.json(contact);
    } catch (e) {
        if (e.name === "ContactNotFoundError") {
            res.status(404).json({ message: "Contact not found" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

// POST /contacts
router.post('/contacts', async (req, res) => {
    try {
        const contact = await ContactModel.create(req.body);
        res.json(contact);
    } catch (e) {
        if (e.name === "InvalidContactError") {
            res.status(422).json({ message: "Invalid contact data" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

// PUT /contacts/:id
router.put('/contacts/:id', async (req, res) => {
    try {
        const contact = await ContactModel.update(req.params.id, req.body);
        res.json(contact);
    } catch (e) {
        if (e.name === "InvalidContactError") {
            res.status(422).json({ message: "Invalid contact data" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

// DELETE /contacts/:id
router.delete('/contacts/:id', async (req, res) => {
    try {
        await ContactModel.delete(req.params.id);
        res.json({ message: 'Contact deleted successfully' });
    } catch (e) {
        if (e.name === "ContactNotFoundError") {
            res.status(404).json({ message: "Contact not found" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});
module.exports = router;