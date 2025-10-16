import React, { useState } from "react";
import ContactsList from "./ContactsList";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setContact((contact) => ({ ...contact, [name]: value }));
  };
  const addHandler = () => {
    setContacts((contacts) => [...Contacts, contact]);
    setContact({
      name: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };
  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={contact.name}
          name="name"
          onChange={changeHandler}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={contact.lastName}
          name="lastName"
          onChange={changeHandler}
        />
        <input
          type="email"
          placeholder="Email"
          value={contact.email}
          name="email"
          onChange={changeHandler}
        />
        <input
          type="number"
          placeholder="Phone"
          value={contact.phone}
          name="phone"
          onChange={changeHandler}
        />
        <button onClick={addHandler}>Add Contact</button>
      </div>
      <ContactsList contacts={contacts}/>
    </div>
  );
}

export default Contacts;
