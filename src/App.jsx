import { useState } from 'react'
import Header from './components/Header'
import Contacts from './components/Contacts'
import ContactsProvider from './contexts/ContactsContext'
function App() {
  

  return (
 <>
 <ContactsProvider>
 <Header/>
 <Contacts/>
 </ContactsProvider>
 </>
    
  )
}

export default App
