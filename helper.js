function filterContacts(contacts, filterBy, filterOperator, filterValue) {
  console.log(`filterBy: ${filterBy}, filterValue: ${filterValue}`);
  console.log(`validFields: ${validFields}`);

  if (!filterBy || !filterOperator || !filterValue) {
    throw new Error('Missing filter criteria');
  }

  if (typeof filterBy !== 'string') {
    throw new Error('filterBy must be a string');
  }

  const validFields = ['id', 'fname', 'lname', 'phone', 'birthday', 'email'];

  if (!validFields.includes(filterBy)) {
    console.log(`filterBy: ${filterBy}, validFields: ${validFields}`);
    throw new Error(`Invalid filter field: ${filterBy}`);
  }

}

  if (!contacts || contacts.length === 0) {
    throw new Error('No contacts to filter');
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
          throw new Error(`Invalid filter operator: ${filterOperator}`);
      }
    });

    if (filteredContacts.length === 0) {
      throw new Error(`No contacts match the filter criteria`);
    }

    return filteredContacts;
  } catch (error) {
    throw error;
  }
}