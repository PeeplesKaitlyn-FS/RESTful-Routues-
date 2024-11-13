function filterContacts(contacts, filterBy, filterOperator, filterValue) {
  if (!filterBy || !filterOperator || !filterValue) {
    return contacts;
  }

  try {
    const filteredContacts = contacts.filter((contact) => {
      const contactValue = contact[filterBy];
      switch (filterOperator) {
        case 'eq':
          return contactValue === parseInt(filterValue); // Convert filterValue to integer
        case 'neq':
          return contactValue !== parseInt(filterValue); // Convert filterValue to integer
        case 'lt':
          return contactValue < parseInt(filterValue); // Convert filterValue to integer
        case 'gt':
          return contactValue > parseInt(filterValue); // Convert filterValue to integer
        default:
          throw new Error(`Invalid filter operator: ${filterOperator}`);
      }
    });

    return filteredContacts;
  } catch (error) {
    return { message: error.message };
  }
}