import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import ContactsList from "./ContactsList";
import inputs from "../constansts/inputs";
import ConfirmModal from "./ConfirmModal";

import styles from "./Contacts.module.css";
import SearchBox from "./SearchBox";
import Form from "./Form";
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
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false);
  const [pendingEdit, setIsPendingEdit] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [selectId, setSelectId] = useState([]);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setContact((contact) => ({ ...contact, [name]: value }));
  };
  // const addHandler = () => {
  //   if (
  //     !contact.name ||
  //     !contact.lastName ||
  //     !contact.email ||
  //     !contact.phone
  //   ) {
  //     setAlert("Please enter valid data!");
  //     return;
  //   }
  //   setAlert("");
  //   const newContact = { ...contact, id: v4() };
  //   setContacts((contacts) => [...contacts, newContact]);
  //   setContact({
  //     name: "",
  //     lastName: "",
  //     email: "",
  //     phone: "",
  //   });
  // };
  const deleteHandler = (id) => {
    console.log("real");
    const newContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(newContacts);
  };
  const handleDelete = (id) => {
    console.log("Ask", id);
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
  };
  const confirmDeleteHandler = () => {
    console.log("confirm", pendingDeleteId);
    if (pendingDeleteId == null) return;
    deleteHandler(pendingDeleteId);
    setPendingDeleteId(null);
    setIsConfirmOpen(false);
  };
  const cancelDeleteHandler = () => {
    setPendingDeleteId(null);
    setIsConfirmOpen(false);
  };
  const toggleHandler = (id) => {
    setSelectId((prev) =>
      prev.includes(id)
        ? prev.filter((selectId) => selectId !== id)
        : [...prev, id]
    );
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
  const requestSaveEdit = () => {
    const candidate = { id: edit, ...contact };
    setIsPendingEdit(candidate);
    setIsConfirmEditOpen(true);
  };
  const confirmSaveEditHandler = () => {
    if (!pendingEdit) return;

    setContacts((prev) =>
      prev.map((c) => (c.id === pendingEdit.id ? pendingEdit : c))
    );
    setIsPendingEdit(null);
    setIsConfirmEditOpen(false);
    setIsEditOpen(false);
    setEdit(null);

    setContact({
      name: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };
  const cancelSaveHandler = () => {
    setIsPendingEdit(null);
    setIsConfirmEditOpen(false);
  };
  const normalize = (v) => String(v ?? "".toLowerCase());
  const text = (search ?? "").toLowerCase().trim();
  const filterContact = contacts.filter((contact) => {
    if (!text) return true;
    return (
      normalize(contact.name).includes(text) ||
      normalize(contact.lastName).includes(text) ||
      normalize(contact.email).includes(text)
    );
  });
  const confirmGroupDelete = () => {
    setContacts((prev) =>
      prev.filter((contact) => !selectId.includes(contact.id))
    );
    setSelectId([]);
    setConfirmDelete(false);
  };
  const cancelGroupDelete = () => [setConfirmDelete(false)];
  const openAdd = () => {
    setIsAddOpen(true);
  };
  const closeAdd = () => {
    setIsAddOpen(false);
  };
  const handleAddSubmit = (values) => {
    console.log("parent got")
    const newContact = { id: uuidv4(), ...values };
    console.log("ADD in parent:",values)
    setContacts((prev) => [...prev, newContact]);
    setIsAddOpen(false);
    setSearch("")
  };
  return (
    <>
      <div className={styles.container}>
        <div>
          <SearchBox
            search={search}
            setSearch={setSearch}
            toggleHandler={toggleHandler}
          />
        </div>
        <div className={styles.form}>
          {!isAddOpen && (
            <>
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

              <button
                onClick={() => {
                  if (isEditOpen) {
                    requestSaveEdit();
                  } else {
                    setIsAddOpen(true);
                  }
                }}
              >
                {isEditOpen ? "save changes" : "add contact"}
              </button>
            </>
          )}
        </div>

        <div className={styles.alert}>{alert && <p>{alert}</p>}</div>
      
        {isAddOpen && (
          <div
            className={styles.validationForm}
            onClick={() => setIsAddOpen(false)}
          >
            <div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
            >

              <h3>Confirm form</h3>

              <Form
                contacts={contacts}
                onSubmit={handleAddSubmit}
                onCancel={() => setIsAddOpen(false)}
              />
              <ul>
                {contacts.map((c)=>{
                  <li key={c.id}>
                    {c.name}{c.lastName}{c.email}{c.phone}
                  </li>
                })}
              </ul>
            </div>
          </div>
        )}
        <ContactsList
          contacts={filterContact}
          handleDelete={handleDelete}
          editHandler={editHandler}
          toggleHandler={toggleHandler}
          selectId={selectId}
        />
        {isConfirmOpen && (
          <ConfirmModal
            onConfirm={confirmDeleteHandler}
            onCancel={cancelDeleteHandler}
            message={"Are you sure you want to delete?"}
          />
        )}
        {isConfirmEditOpen && (
          <ConfirmModal
            message="Are you sure  you want to apply these changes?"
            onConfirm={confirmSaveEditHandler}
            onCancel={cancelSaveHandler}
          />
        )}
        {setSelectId.length > 0 && (
          <button
            onClick={() => setConfirmDelete(true)}
            className={styles.deleteBtn}
          >
            DeleteSelected({selectId.length})
          </button>
        )}
        {confirmDelete && (
          <ConfirmModal
            message={`Are you sure you want to delete${selectId.length}contacts?`}
            onCancel={() => setConfirmDelete(false)}
            onConfirm={confirmGroupDelete}
          />
        )}
      </div>
    </>
  );
}

export default Contacts;
