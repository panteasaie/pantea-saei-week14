import React from "react";
import styles from "./SearchBox.module.css";
import { FaSearch } from "react-icons/fa";
function SearchBox({ search, setSearch }) {
  return (
    <div>
      <FaSearch style={{color:"#304ffe"}} />
      <input
        type="text"
        placeholder="Search here"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
}

export default SearchBox;
