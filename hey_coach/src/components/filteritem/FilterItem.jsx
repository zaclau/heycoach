import { useState } from "react";
import "./filteritem.css";

const FilterItem = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <li className="filter-item">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </li>
  );
}

export default FilterItem;

