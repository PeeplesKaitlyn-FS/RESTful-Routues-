const express = require('express');
const router = express.Router();
const ContactModel = require('@jworkman-fs/asl').ContactModel;
const { filterContacts, sortContacts, Pager } = require('@jworkman-fs/asl'); 


router.get('/contacts', (req, res) => {
    try {
        const contacts = ContactModel.getAll();
        
        const filtered = filterContacts(contacts, req.get('X-Filter-By'), req.get('X-Filter-Value'));


        const sorted = sortContacts(filtered, req.query.sort, req.query.direction);


        const pager = new Pager(sorted, req.query.page, req.query.size);
        res.set("X-Page-Total", pager.total());
        res.set("X-Page-Next", pager.next());
        res.set("X-Page-Prev", pager.prev());
        res.json(pager.results());
    } catch (e) {
        switch (e.name) {
            case "InvalidContactError":
                return res.status(422).json({ message: "Invalid contact data" });
            case "ContactNotFoundError":
                return res.status(404).json({ message: "Contact not found" });
            case "PagerOutOfRangeError":
                return res.status(400).json({ message: "Invalid page or size parameter" });
            case "InvalidEnumError":
                return res.status(400).json({ message: "Invalid sort or direction parameter" });
            case "PagerLimitExceededError":
                return res.status(400).json({ message: "Page size limit exceeded" });
            default:
                return res.status(500).json({ message: "Internal server error" });
        }
    }
});



// GET /contacts/:id
router.get('/contacts/:id', (req, res) => {
    try {
        // Get contact by ID
        const contact = ContactModel.get(req.params.id);


        // Check if contact exists
        if (!contact) {
            throw new Error("Contact not found");
        }


        // Return result
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
router.post('/contacts', (req, res) => {
    try {
        const contact = ContactModel.create(req.body);

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
router.put('/contacts/:id', (req, res) => {
    try {
        const contact = ContactModel.update(req.params.id, req.body);


        // Return result
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
router.delete('/contacts/:id', (req, res) => {
    try {
        // Delete contact
        ContactModel.delete(req.params.id);


        // Return result
        res.json({ message: 'Contact deleted successfully' });
    } catch (e) {
       const express = require('express');
       const router = express.Router();
       const ContactModel = require('@jworkman-fs/asl').ContactModel;
       const { filterContacts, sortContacts, Pager } = require('@jworkman-fs/asl'); 
       
       
       router.get('/contacts', (req, res) => {
           try {
               const contacts = ContactModel.getAll();
               const filtered = filterContacts(contacts, req.get('X-Filter-By'), req.get('X-Filter-Value'));
               const sorted = sortContacts(filtered, req.query.sort, req.query.direction);
               const pager = new Pager(sorted, req.query.page, req.query.size);
               res.set("X-Page-Total", pager.total());
               res.set("X-Page-Next", pager.next());
               res.set("X-Page-Prev", pager.prev());
               res.json(pager.results());
           } catch (e) {
               switch (e.name) {
                   case "InvalidContactError":
                       return res.status(422).json({ message: "Invalid contact data" });
                   case "ContactNotFoundError":
                       return res.status(404).json({ message: "Contact not found" });
                   case "PagerOutOfRangeError":
                       return res.status(400).json({ message: "Invalid page or size parameter" });
                   case "InvalidEnumError":
                       return res.status(400).json({ message: "Invalid sort or direction parameter" });
                   case "PagerLimitExceededError":
                       return res.status(400).json({ message: "Page size limit exceeded" });
                   default:
                       return res.status(500).json({ message: "Internal server error" });
               }
           }
       });
       
       
       
       router.get('/contacts/:id', (req, res) => {
           try {
               const contact = ContactModel.get(req.params.id);
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
       
       
       
       router.post('/contacts', (req, res) => {
           try {
               const contact = ContactModel.create(req.body);
               res.json(contact);
           } catch (e) {
               if (e.name === "InvalidContactError") {
                   res.status(422).json({ message: "Invalid contact data" });
               } else {
                   res.status(500).json({ message: "Internal server error" });
               }
           }
       });
       
       
       
       router.put('/contacts/:id', (req, res) => {
           try {
               const contact = ContactModel.update(req.params.id, req.body);
               res.json(contact);
           } catch (e) {
               if (e.name === "InvalidContactError") {
                   res.status(422).json({ message: "Invalid contact data" });
               } else {
                   res.status(500).json({ message: "Internal server error" });
               }
           }
       });
       
       
       
       router.delete('/contacts/:id', (req, res) => {
           try {
               ContactModel.delete(req.params.id);
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