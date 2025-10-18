import React from 'react'
import styles from './ContactItem.module.css'
import { FaTrashCan,FaPhoneVolume } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
function ContactItem({data:{id,name,lastName,email,phone},deleteHandler,}) {
  
  return (
    <li className={styles.item}>
              <p>
                {name}
                {lastName}
              </p>
              <p>
                <span><MdOutlineAlternateEmail/></span>
                {email}
              </p>
              <p>
                <span><FaPhoneVolume/></span>
                {phone}
              </p>
              <button onClick={()=>deleteHandler(id)} ><FaTrashCan/></button>
            </li>
  )
}

export default ContactItem