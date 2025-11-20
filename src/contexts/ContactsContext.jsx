import React, { useEffect, useState } from "react";
import { createContext, useContext, useReducer } from "react";
import contactsReducer from "../hooks/contacts-reducer";
import { v4 as uuidv4 } from "uuid";
const BASE_URL = "http://localhost:3001";
export const ContactsContext = createContext(null);
const ContactsDispatchContext = createContext(null);
const initialState = {
  contacts: [],
  selectIds: [],
  searchTerm: "",
  loading: false,
  error: null,
  editingContact: null,
  modal: {
    open: false,
    type: null,
    payload: null,
  },
};
export function ContactsProvider({ children }) {
  const [state, dispatch] = useReducer(contactsReducer, initialState);
  const[selectIds,setSelectIds]=useState([])
  useEffect(() => {
    async function fetchContacts() {
      try {
      dispatch({type:"LOAD_CONTACTS_REQUEST"})
        const res = await fetch(`${BASE_URL}/contacts`);
        const data = await res.json();
        dispatch({type:"LOAD_CONTACTS_SUCCESS",payload:data,});
      } catch (err) {
        dispatch({type:"LOAD_CONTACTS_FAILURE",payload:err.message})
      } finally {

      }
    }
    fetchContacts();
  }, []);
  const addContact = async (values) => {
    
    const newContact={...values,id:uuidv4()}
    const res = await fetch(BASE_URL + "/contacts", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newContact),
    });
    const data = await res.json();
    // setContacts((prev) => [...prev, data]);
    dispatch({
    type:"ADD_CONTACT",payload:data}
    )
  };
  const updateContact = async (updatedContact) => {
    const res = await fetch(BASE_URL + "/contacts/" + updatedContact.id, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedContact),
    });
    const data = await res.json();
    // setContacts((prev) => prev.map((c) => (c.id === data.id ? data : c)));
    dispatch({type:"UPDATE_CONTACT",payload:data})
  };
  const deleteContact = async (id) => {
    await fetch(`${BASE_URL}/contacts/${id}`, {
      method: "DELETE",
    });
    // setContacts((prev) => {
    //   return prev.filter((c) => c.id !== id);
    // });
    dispatch({type:"DELETE_CONTACT",payload:id})
  };
  const deleteGroupContact = async (ids) => {
    for (const id of ids) {
      await fetch(`${BASE_URL}/contacts/${id}`, {
        method: "DELETE",
      });
    }
    // setContacts((prev) => prev.filter((c) => !selectId.includes(c.id)));
    // setSelectId([]);
    dispatch({type:"DELETE_GROUP_CONTACT",payload:ids})
  };
  const toggleSelect = (id) => {
    setSelectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const clearSelect = () => {
    setSelectIds([]);
  };
  return (
    <ContactsContext.Provider value={{...state,addContact,updateContact,deleteContact,deleteGroupContact,selectIds,toggleSelect,clearSelect}}>
      <ContactsDispatchContext.Provider value={dispatch}>
        {children}
      </ContactsDispatchContext.Provider>
    </ContactsContext.Provider>
  );
}
export function useContactsState() {
  return useContext(ContactsContext);
}
export function useContactsDispatch() {
  return useContext(ContactsDispatchContext);
}
export default ContactsProvider;
