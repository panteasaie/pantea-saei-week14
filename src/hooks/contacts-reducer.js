function contactsReducer(state, action) {
  switch (action.type) {
    case "LOAD_CONTACTS_REQUEST": {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case "LOAD_CONTACTS_SUCCESS": {
      return {
        ...state,
        loading: false,
        contacts: action.payload,
      };
    }
    case "LOAD_CONTACTS_FAILURE": {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    case "ADD_CONTACT": {
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
      };
    }
    case "UPDATE_CONTACT": {
      const updateContacts = state.contacts.map((contact) => {
        if (contact.id === action.payload.id) {
          return action.payload;
        } else {
         return  contact;
        }
      });
      return{
        ...state,
        contacts:updateContacts
      }
    }
    case "DELETE_CONTACT": {
      const newContacts = state.contacts.filter(
        (contact) => contact.id !== action.payload
      );

      return {
        ...state,
        contacts: newContacts,
      };
    }
  case "DELETE_GROUP_CONTACT":{
    const ids=action.payload;
    const newContacts=state.contacts.filter((contact)=>!ids.includes(contact.id));
    return{
      ...state,
      contacts:newContacts,
    }
  }
    default:
      return state;
  }
}

export default contactsReducer;
