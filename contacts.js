const express = require('express');
const router = express.Router();
const ContactModel = require('@jworkman-fs/asl').ContactModel;
const { filterContacts, sortContacts, Pager } = require('@jworkman-fs/asl');

// Define the getAll method as a static method on the ContactModel object
ContactModel.prototype.getAll = async function() {
  try {
    const contacts = await db.query('SELECT * FROM contacts');
    return contacts;
  } catch (error) {
    throw error;
  }
};

// Error handler function
const errorHandler = (error, res) => {
  // ... error handling code ...
};

// GET /
router.get('/', async (req, res) => {
  try {
    const contacts = await ContactModel.getAll();
    if (!contacts || contacts.length === 0) {
      return res.json({
        "contacts": [],
        "pagination": {
          "total": 0,
          "next": null,
          "prev": null
        }
      });
    }
    const filtered = filterContacts(contacts, req.get('X-Filter-By'), req.get('X-Filter-Operator'), req.get('X-Filter-Value'));
    const sorted = sortContacts(filtered, req.query.sort, req.query.direction);
    const pager = new Pager(sorted, req.query.page, req.query.size);

    res.set("X-Page-Total", pager.total());
    res.set("X-Page-Next", pager.next());
    res.set("X-Page-Prev", pager.prev());

    res.json({
      "contacts": pager.results(),
      "pagination": {
        "total": pager.total(),
        "next": pager.next(),
        "prev": pager.prev()
      }
    });
  } catch (error) {
    console.error(error);
    errorHandler(error, res);
  }
});

// GET /:id
router.get('/:id', async (req, res) => {
  try {
    const contact = await ContactModel.get(req.params.id);
    if (!contact) {
      throw new Error("Contact not found");
    }
    res.json({
      "contact": contact
    });
  } catch (error) {
    errorHandler(error, res);
  }
});

// POST /
router.post('/', async (req, res) => {
  try {
    const contact = await ContactModel.create(req.body);
    res.json({
      "contact": contact
    });
  } catch (error) {
    errorHandler(error, res);
  }
});

// PUT /:id
router.put('/:id', async (req, res) => {
  try {
    const contact = await ContactModel.update(req.params.id, req.body);
    res.json({
      "contact": contact
    });
  } catch (error) {
    errorHandler(error, res);
  }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    await ContactModel.delete(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    errorHandler(error, res);
  }
});

module.exports = router;