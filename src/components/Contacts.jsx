import React, { useState } from "react";
import { v4 } from "uuid";
import ContactsList from "./ContactsList";
import inputs from "../constansts/inputs";
import styles from "./Contacts.module.css";
import ConfirmModal from "./ConfirmModal";
function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [alert, setAlert] = useState("");
  const [contact, setContact] = useState({
    id: "",
    name: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [edit, setEdit] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setContact((contact) => ({ ...contact, [name]: value }));
  };
  const addHandler = () => {
    if (
      !contact.name ||
      !contact.lastName ||
      !contact.email ||
      !contact.phone
    ) {
      setAlert("Please enter valid data!");
      return;
    }
    setAlert("");
    const newContact = { ...contact, id: v4() };
    setContacts((contacts) => [...contacts, newContact]);
    setContact({
      name: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };
  const deleteHandler = (id) => {
    console.log("real")
    const newContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(newContacts);
    
  };
  const handleDelete = (id) => {
    console.log("Ask",id)
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
    
  };
  const confirmDeleteHandler = () => {
    console.log("confirm",pendingDeleteId)
    if (pendingDeleteId == null) return;
    deleteHandler(pendingDeleteId);
    setPendingDeleteId(null);
    setIsConfirmOpen(false);
  };
  const cancelDeleteHandler = () => {
    setPendingDeleteId(null);
    setIsConfirmOpen(false);
  };
  const editHandler = (id) => {
    const editContact = contacts.find((contact) => contact.id === id);

    if (!editContact) return;
    setContact({
      name: editContact.name,
      lastName: editContact.lastName,
      email: editContact.email,
      phone: editContact.phone,
    });
    setIsEditOpen(true);
    setEdit(id);
  };
  const saveEdit = () => {
    const update = {
      id: edit,
      ...contact,
    };
    setContacts((prev) => prev.map((c) => (c.id === edit ? update : c)));
    setContact({
      name: "",
      lastName: "",
      email: "",
      phone: "",
    });
    setIsEditOpen(false);
    setEdit(null);
  };
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        {inputs.map((input, index) => (
          <input
            key={index}
            type={input.type}
            placeholder={input.placeholder}
            name={input.name}
            value={contact[input.name]}
            onChange={changeHandler}
          />
        ))}

        <button onClick={isEditOpen ? saveEdit : addHandler}>
          {isEditOpen ? "save changes" : "add contact"}
        </button>
      </div>
      <div className={styles.alert}>{alert && <p>{alert}</p>}</div>
      <ContactsList
        contacts={contacts}
        handleDelete={handleDelete}
        editHandler={editHandler}
      />
      {isConfirmOpen && (
        <ConfirmModal
          onConfirm={confirmDeleteHandler}
          onCancel={cancelDeleteHandler}
          message={"Are you sure you want to delete?"}
        />
      )}
    </div>
  );
}

export default Contacts;
