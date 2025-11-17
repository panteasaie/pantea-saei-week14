import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import ContactsList from "./ContactsList";
import inputs from "../constansts/inputs";
import ConfirmModal from "./ConfirmModal";

import styles from "./Contacts.module.css";
import SearchBox from "./SearchBox";
import useContacts from "../hooks/useContacts";
function Contacts() {
  const {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    deleteGroupContact,
    selectId,
    setSelectId,
    toggleSelect,
    clearSelect,
  } = useContacts();
  const [alert, setAlert] = useState("");
  const [contact, setContact] = useState({
    id: "",
    name: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState(() => ({
    name: null,
    lastName: null,
    email: null,
    phone: null,
  }));
  const [touch, setTouch] = useState({});
  const [edit, setEdit] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false);
  const [pendingEdit, setIsPendingEdit] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const changeHandler = (event) => {
    const { name, value } = event.target;
    setContact((prev) => ({ ...prev, [name]: value }));
    const errorMessage = validatefield(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const deleteHandler = (id) => {
    deleteContact(id);
  };
  const handleDelete = (id) => {
    console.log("Ask", id);
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
  };
  const confirmDeleteHandler = () => {
    console.log("confirm", pendingDeleteId);
    if (pendingDeleteId == null) return;
    deleteContact(pendingDeleteId);
    setPendingDeleteId(null);
    setIsConfirmOpen(false);
  };
  const cancelDeleteHandler = () => {
    setPendingDeleteId(null);
    setIsConfirmOpen(false);
  };
  const toggleHandler = (id) => {
    toggleSelect(id);
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

    updateContact(pendingEdit);
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
    deleteGroupContact(selectId);
    clearSelect();
    setConfirmDelete(false);
  };
  const cancelGroupDelete = () => [setConfirmDelete(false)];
  const openAdd = () => {
    setIsAddOpen(true);
  };
  const closeAdd = () => {
    setIsAddOpen(false);
  };

  const handleAddSubmit = async () => {
    const nextErrors = {
      name: validatefield("name", contact.name),
      lastName: validatefield("lastName", contact.lastName),
      email: validatefield("email", contact.email),
      phone: validatefield("phone", contact.phone),
    };

    setErrors(nextErrors);

    // ۲. اگر هر فیلدی خطا داشت => return
    const hasError = Object.values(nextErrors).some((e) => e !== null);
    if (hasError) {
      setTouch({
        name: true,
        lastName: true,
        email: true,
        phone: true,
      });
      return;
    }

    // ۳. ارسال به API
    await addContact(contact);

    // ۴. ریست کردن فرم
    setContact({
      name: "",
      lastName: "",
      email: "",
      phone: "",
    });

    setIsAddOpen(false);
  };

const validatefield = (field, rawValue) => {
  const v = String(rawValue ?? "");
  const t = v.trim();

  if (field === "name") {
    if (!t) return "نام الزامیست";
    if (t.length < 2) return "حداقل 2 کارکتر!";
    return null;
  }
  if (field === "latName") {
    if (!t) return "نام خانوادگی الزامیست";
    if (t.length < 2) return "حداقل 2 کارکتر";
    return null;
  }
  if (field === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!t) return "ایمیل الزامیست";
    if (!emailRegex.test(t)) return "فرمت ایمیل نامعتبر است";

    const isDublicate = contacts.some(
      (c) => c.email.toLowerCase() === t.toLowerCase()
    );
    if (isDublicate) return "این ایمیل قبلا ثبت شده";
    return null;
  }
  if (field === "phone") {
    if (!t) return null;
    if (!/^\+?\d{8,15}$/.test(t)) return "شماره نامعتبر";
    return null;
  }
  return null;
};

const handleBlur = (event) => {
  const { name } = event.target;
  setTouch((prev) => ({ ...prev, [name]: true }));
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
              <div key={index}>
                <input
                  key={index}
                  type={input.type}
                  placeholder={input.placeholder}
                  name={input.name}
                  value={contact[input.name]}
                  onChange={changeHandler}
                  onBlur={handleBlur}
                />
                {touch[input.name] && errors[input.name] && (
                  <p className={styles.errorText}>{errors[input.name]}</p>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                if (isEditOpen) {
                  requestSaveEdit();
                } else {
                  handleAddSubmit()
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
          ></div>
        </div>
      )}
      <ContactsList
        contacts={filterContact}
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
