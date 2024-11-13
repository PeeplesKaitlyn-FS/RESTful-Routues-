const express = require('express');
const router = express.Router();
const self = require('./contactModel');
const { Pager, filterContacts, sortContacts } = require('./helper');
const {
  ContactResourceError,
  ContactNotFoundError,
  ApiError,
  PagerError,
  PagerNoResultsError,
  PagerOutOfRangeError,
  NoContactsFoundError,
  InvalidContactSchemaError,
} = require('./errors');

// Error handler function
const errorHandler = (error, res) => {
  if (error instanceof ContactResourceError) {
    res.status(error.statusCode).json({ message: error.message });
  } else {
    switch (error.name) {
      case ContactNotFoundError.name:
        res.status(404).json({ message: error.message });
        break;
      case ApiError.name:
        res.status(error.statusCode).json({ message: error.message });
        break;
      case PagerError.name:
      case PagerNoResultsError.name:
      case PagerOutOfRangeError.name:
        res.status(500).json({ message: error.message });
        break;
      case NoContactsFoundError.name:
      case InvalidContactSchemaError.name:
        res.status(400).json({ message: error.message });
        break;
      default:
        res.status(500).json({ message: 'Something went wrong' });
    }
  }
};


// GET /
router.get('/', async (req, res) => {
    try {
      if (Array.isArray(req.query.filterBy)) {
        return res.status(400).json({ message: 'filterBy must be a single string value' });
      }
      if (typeof req.query.filterBy !== 'string') {
        throw new ApiError(400, 'filterBy must be a string value');
      }
      const contacts = await self.index();
      const filtered = filterContacts(contacts, req.query.filterBy, req.query.filterOperator, req.query.filterValue);
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
    errorHandler(error, res);
  }
});


// GET /:id
router.get('/:id', async (req, res) => {
  try {
    const contact = await self.show(req.params.id);
    res.json({ "contact": contact });
  } catch (error) {
    errorHandler(error, res);
  }
});


// POST /
router.post('/', async (req, res) => {
  try {
    const contact = await self.create(req.body);
    res.json({ "contact": contact });
  } catch (error) {
    errorHandler(error, res);
  }
});


// PUT /:id
router.put('/:id', async (req, res) => {
  try {
    const contact = await self.update(req.params.id, req.body);
    res.json({ "contact": contact });
  } catch (error) {
    errorHandler(error, res);
  }
});


// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    await self.remove(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    errorHandler(error, res);
  }
});


module.exports = router;