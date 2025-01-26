const express = require('express');
const router = express.Router();
const self = require('./contactModel');
const { Pager, filterContacts, sortContacts } = require('./helper');
console.log(typeof filterContacts);
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
  console.error('Error occurred:', error.stack);
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
        res.status(404).json({ message: error.message });
        break;
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
    console.log('Request Query:', req.query);
    const allowedFilterByValues = ['id', 'name', 'email'];
    const allowedFilterOperators = ['=', '!=', '>', '<', '>=', '<='];

    if (!req.query.filterBy || typeof req.query.filterBy !== 'string' || !allowedFilterByValues.includes(req.query.filterBy)) {
      console.log('filterBy is not a valid string');
      return res.status(400).json({ message: 'filterBy must be a valid string (id, name, email)' });
    }

    if (!req.query.filterOperator || typeof req.query.filterOperator !== 'string' || !allowedFilterOperators.includes(req.query.filterOperator)) {
      console.log('filterOperator is not a valid string');
      return res.status(400).json({ message: 'filterOperator must be a valid string (=, !=, >, <, >=, <=)' });
    }

    if (!req.query.filterValue) {
      console.log('filterValue is not provided');
      return res.status(400).json({ message: 'filterValue is required' });
    }

    const contacts = await self.index();
    console.log('Contacts:', contacts);
    if (!contacts) {
      console.log('No contacts found');
      throw new NoContactsFoundError('No contacts found');
    }
    const filtered = filterContacts(contacts, req.query.filterBy, req.query.filterOperator, req.query.filterValue);
    console.log('Filtered Contacts:', filtered);
    if (!filtered) {
      console.log('No filtered contacts found');
      throw new PagerNoResultsError('No filtered contacts found');
    }
    const sorted = sortContacts(filtered, req.query.sort, req.query.direction);
    console.log('Sorted Contacts:', sorted);
    if (!sorted) {
      console.log('No sorted contacts found');
      throw new PagerNoResultsError('No sorted contacts found');
    }
    const pager = new Pager(sorted, req.query.page, req.query.size);
    console.log('Pager:', pager);
    if (!pager) {
      console.log('No pager found');
      throw new PagerError('No pager found');
    }
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
    console.error('Error occurred:', error.stack);
    res.status(500).json({ message: 'Something went wrong', error: error.message, stack: error.stack });
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