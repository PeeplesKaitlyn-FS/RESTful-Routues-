function filterContacts(contacts, filterBy, filterOperator, filterValue) {
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

  const validFields = ['id', 'fname', 'lname', 'phone', 'birthday', 'email'];

  if (!validFields.includes(filterBy)) {
    console.log(`filterBy: ${filterBy}, validFields: ${validFields}`);
    throw new InvalidContactSchemaError(`Invalid filter field: ${filterBy}`);
  }

  try {
    const filteredContacts = contacts.filter((contact) => {
      const contactValue = contact[filterBy];
      switch (filterOperator) {
        case 'eq':
          return contactValue === filterValue;
        case 'neq':
          return contactValue !== filterValue;
        case 'lt':
          return contactValue < filterValue;
        case 'gt':
          return contactValue > filterValue;
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