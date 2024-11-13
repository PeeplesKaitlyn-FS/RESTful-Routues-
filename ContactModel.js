class ContactModel {
  constructor() {
    this.contacts = [
      { id: 1, fname: 'John', lname: 'Doe', phone: '123-456-7890', birthday: '1990-01-01', email: 'john.doe@example.com' },
      { id: 2, fname: 'Jane', lname: 'Doe', phone: '987-654-3210', birthday: '1995-06-15', email: 'jane.doe@example.com' },
    ];
  }


  async index() {
    return this.contacts;
  }


  async show(id) {
    const contact = this.contacts.find((contact) => contact.id === parseInt(id));
    if (!contact) {
      throw new ContactNotFoundError(`Contact not found with id ${id}`);
    }
    return contact;
  }


  async create(contact) {
    const newContact = { id: this.contacts.length + 1, ...contact };
    this.contacts.push(newContact);
    return newContact;
  }


  async update(id, contact) {
    const index = this.contacts.findIndex((contact) => contact.id === parseInt(id));
    if (index === -1) {
      throw new ContactNotFoundError(`Contact not found with id ${id}`);
    }
    this.contacts[index] = { ...this.contacts[index], ...contact };
    return this.contacts[index];
  }


  async remove(id) {
    const index = this.contacts.findIndex((contact) => contact.id === parseInt(id));
    if (index === -1) {
      throw new ContactNotFoundError(`Contact not found with id ${id}`);
    }
    this.contacts.splice(index, 1);
  }
}


class ContactNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ContactNotFoundError';
  }
}


module.exports = new ContactModel();