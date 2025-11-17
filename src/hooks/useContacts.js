import { useContext } from "react";
import { ContactsContext } from "../contexts/ContactsContext";
function useContacts() {
  return useContext(ContactsContext);
}
export default useContacts;
