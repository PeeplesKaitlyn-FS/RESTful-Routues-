const { NoContactsFoundError, InvalidContactSchemaError } = require('./errors');

class Pager {
  constructor(page, limit, contacts) {
    this.page = page;
    this.limit = limit;
    this.contacts = contacts;
    this.offset = (page - 1) * limit;
  }

  total() {
    if (!this.contacts) {
      return 0;
    }
    return this.contacts.length;
  }

  next() {
    const nextPage = this.page + 1;
    const hasNextPage = nextPage * this.limit <= this.contacts.length;
    return hasNextPage ? nextPage : null;
  }

  prev() {
    const prevPage = this.page - 1;
    const hasPrevPage = prevPage >= 1;
    return hasPrevPage ? prevPage : null;
  }

  results() {
    if (!this.contacts) {
      return [];
    }
    return this.contacts.slice(this.offset, this.offset + this.limit);
  }
}

function sortContacts(contacts, sortBy, sortOrder) {
  if (!contacts || contacts.length === 0) {
    return contacts;
  }
  if (!sortBy || !sortOrder) {
    return contacts;
  }
  const sortedContacts = [...contacts];
  sortedContacts.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
  return sortedContacts;
}

function filterContacts(contacts, filterBy, filterOperator, filterValue) {
  const validFields = ['id', 'fname', 'lname', 'phone', 'birthday', 'email'];

  console.log(`filterBy: ${filterBy}, filterValue: ${filterValue}`);
  console.log(`validFields: ${validFields}`);

  if (!contacts || contacts.length === 0) {
    throw new NoContactsFoundError('No contacts to filter');
  }

  if (!filterBy || !filterOperator || !filterValue) {
    throw new InvalidContactSchemaError('Missing filter criteria');
  }

  if (typeof filterBy !== 'string') {
    throw new InvalidContactSchemaError('filterBy must be a string');
  }

  if (!validFields.includes(filterBy)) {
    console.log(`filterBy: ${filterBy}, validFields: ${validFields}`);
    throw new InvalidContactSchemaError(`Invalid filter field: ${filterBy}`);
  }

  try {
    let parsedFilterValue;
    if (filterBy === 'id') {
      parsedFilterValue = parseInt(filterValue);
    } else {
      parsedFilterValue = filterValue;
    }

    const filteredContacts = contacts.filter((contact) => {
      const contactValue = contact[filterBy];
      switch (filterOperator) {
        case 'eq':
        case '=':
          return contactValue === parsedFilterValue;
        case 'neq':
        case '!=':
          return contactValue !== parsedFilterValue;
        case 'lt':
        case '<':
          return contactValue < parsedFilterValue;
        case 'gt':
        case '>':
          return contactValue > parsedFilterValue;
        default:
          throw new InvalidContactSchemaError(`Invalid filter operator: ${filterOperator}`);
      }
    });

    if (filteredContacts.length === 0) {
      throw new NoContactsFoundError(`No contacts match the filter criteria`);
    }

    return filteredContacts;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  Pager,
  filterContacts,
  sortContacts
};