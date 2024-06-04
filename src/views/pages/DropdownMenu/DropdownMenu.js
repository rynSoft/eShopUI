import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';
import './DropdownMenu.css'; // Stil dosyasını dahil edin

const DropdownMenu = ({ options }) => {
  const handleSelect = (eventKey) => {
    console.log(eventKey); // Seçilen seçenekle ilgili işlemleri burada yapabilirsiniz
  };

  return (
    <Dropdown onSelect={handleSelect} className="custom-dropdown">
      <Dropdown.Toggle
        id="dropdown-basic-button"
        variant="secondary"
        size="sm"
      >
        <FaEllipsisV />
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        {options.map((option, index) => (
          <Dropdown.Item key={index} eventKey={option}>
            {option}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownMenu;
