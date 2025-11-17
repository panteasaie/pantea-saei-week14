import React, { useEffect } from "react";
import { createContext } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const BASE_URL = "http://localhost:3001";
export const ContactsContext = createContext();

function ContactsProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectId, setSelectId] = useState([]);
  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BASE_URL}/contacts`);
        const data = await res.json();
        setContacts(data);
      } catch (err) {
        setError("Invalid Contacts!");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);
  const addContact = async(values) => {
    const newContact = { id: uuidv4(), ...values };
    const res=await fetch(BASE_URL+"/contacts",{
      method:"POST",
      headers:{
        "Content-type":"application/json",
      },
      body:JSON.stringify(newContact)
    });
    const data=await res.json()
    setContacts((prev) => [...prev, data]);
  };
  const updateContact = async(updatedContact) => {
    const res=await fetch(BASE_URL+"/contacts/"+updatedContact.id,{
      method:"PUT",
      headers:{
        "Content-type":"application/json",
      },
      body:JSON.stringify(updatedContact)
    });
    const data=await res.json()
    setContacts((prev) =>
      prev.map((c) => (c.id === data.id? data : c))
    );
  };
  const deleteContact =async (id) => {
    await fetch(`${BASE_URL}/contacts/${id}`,{
      method:"DELETE",
    })
    setContacts((prev) => {
      return prev.filter((c) => c.id !== id);
    });
  };
  const deleteGroupContact = async(ids) => {
    for(const id of ids){
      await fetch(`${BASE_URL}/contacts/${id}`,{
        method:"DELETE"
      })
    }
    setContacts((prev) => prev.filter((c) => !selectId.includes(c.id)));
    setSelectId([]);
  };
  const toggleSelect = (id) => {
    setSelectId((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const clearSelect = () => {
    setSelectId([]);
  };
  return (
    <ContactsContext.Provider
      value={{
        contacts,
        selectId,
        setSelectId,
        toggleSelect,
        clearSelect,
        addContact,
        updateContact,
        deleteContact,
        deleteGroupContact,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export default ContactsProvider;
