import React from 'react'
import styles from './ContactItem.module.css'
import { FaTrashCan,FaPhoneVolume } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
function ContactItem({data:{id,name,lastName,email,phone},handleDelete,editHandler}) {
  
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
              <button onClick={()=>handleDelete(id)} ><FaTrashCan/></button>
              <button onClick={()=>editHandler(id)}><RiEdit2Fill/></button>
            </li>
  )
}

export default ContactItem