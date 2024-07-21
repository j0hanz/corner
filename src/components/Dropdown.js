import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsis,
  faEdit,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import styles from './styles/Dropdown.module.css';

const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <FontAwesomeIcon
    className="btn btn-outline-light p-1"
    icon={faEllipsis}
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

const CustomDropdown = ({ handleEdit, handleDelete }) => (
  <Dropdown drop="start" className="ms-auto">
    <Dropdown.Toggle as={ThreeDots} id="dropdown-basic" />

    <Dropdown.Menu className={styles.DropdownMenu}>
      <Dropdown.Item onClick={handleEdit} className={styles.DropdownItem}>
        <span className={styles.faEdit}>Edit</span>{' '}
        <FontAwesomeIcon icon={faEdit} className={styles.faEdit} />
      </Dropdown.Item>
      <Dropdown.Item onClick={handleDelete} className={styles.DropdownItem}>
        <span className={styles.faTrashAlt}>Delete</span>{' '}
        <FontAwesomeIcon icon={faTrashAlt} className={styles.faTrashAlt} />
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

export default CustomDropdown;
