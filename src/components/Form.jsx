import React, { useState } from "react";
import styles from "./Form.module.css";
function Form({ contacts, onSubmit, onCancel }) {
  const [errors, setErrors] = useState(() => ({
    name: null,
    lastName: null,
    email: null,
    phone: null,
  }));

  const [values, setValues] = useState(() => ({
    name: "",
    lastName: "",
    email: "",
    phone: "",
  }));
  const [touch, setTouch] = useState({});
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
  const changeHandler = (event) => {
    const { name, value } = event.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((err) => ({ ...err, [name]: validatefield(name, value) }));
  };
  const handleBlur = (event) => {
    setTouch((t) => ({ ...t, [event.target.name]: true }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {
      name: validatefield("name", values.name),
      lastName: validatefield("lastName", values.lastName),
      email: validatefield("email", values.email),
      phone: validatefield("phone", values.phone),
    };
    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      setTouch({ name: true, lastName: true, email: true, phone: true });
      return;
    }
    console.log("form submit ok", values);
    onSubmit(values);
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <label>name:</label>
          <input
            name="name"
            value={values.name}
            onChange={changeHandler}
            onBlur={handleBlur}
            className={`${styles.input}${
              touch.name && errors.name ? styles.error : ""
            }`}
          />

          {touch.name && errors.name && (
            <p className={styles.errorText}>{errors.name}</p>
          )}
        </div>
        <div className={styles.row}>
          <label>lastName:</label>
          <input
            name="lastName"
            value={values.lastName}
            onChange={changeHandler}
            onBlur={handleBlur}
            className={`${styles.input}${
              touch.lastName && errors.lastName ? styles.error : ""
            }`}
          />

          {touch.lastName && errors.lastName && (
            <p className={styles.errorText}>{errors.lastName}</p>
          )}
        </div>
        <div className={styles.row}>
          <label>Email:</label>
          <input
            name="email"
            value={values.email}
            onChange={changeHandler}
            onBlur={handleBlur}
            className={`${styles.input}${
              touch.email && errors.email ? styles.error : ""
            }`}
          />

          {touch.email && errors.email && (
            <p className={styles.errorText}>{errors.email}</p>
          )}
        </div>
        <div className={styles.row}>
          <label>Phone:</label>
          <input
            name="phone"
            value={values.phone}
            onChange={changeHandler}
            onBlur={handleBlur}
            className={`${styles.input}${
              touch.phone && errors.phone ? styles.error : ""
            }`}
          />

          {touch.phone && errors.phone && (
            <p className={styles.errorText}>{errors.phone}</p>
          )}
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={handleSubmit} className={styles.save}>
            Save
          </button>
          <button type="button" onClick={onCancel} className={styles.error}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
