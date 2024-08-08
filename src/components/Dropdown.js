import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsis,
  faEdit,
  faTrashAlt,
  faUserEdit,
  faImage,
  faUser,
  faLock,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';
import styles from './styles/Dropdown.module.css';

// Custom component for the three dots icon used in dropdown toggles
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

// Dropdown component for edit and delete actions
const EditDeleteDropdown = ({ handleEdit, handleDelete }) => (
  <Dropdown drop="start" className="ms-auto">
    <Dropdown.Toggle as={ThreeDots} id="edit-delete-dropdown" />

    <Dropdown.Menu className={styles.DropdownMenu}>
      <Dropdown.Item onClick={handleEdit} className={styles.DropdownItem}>
        <span>Edit</span>
        <FontAwesomeIcon icon={faEdit} className={styles.Icon} />
      </Dropdown.Item>
      <Dropdown.Item onClick={handleDelete} className={styles.DropdownItem}>
        <span>Delete</span>
        <FontAwesomeIcon icon={faTrashAlt} className={styles.Icon} />
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

// Dropdown component for profile actions
const ProfileActionsDropdown = ({
  handleEditProfile,
  handleChangeProfileImage,
  handleChangeUsername,
  handleChangePassword,
  handleDeleteAccount,
}) => (
  <Dropdown drop="down">
    <Dropdown.Toggle as={ThreeDots} id="profile-actions-dropdown" />

    <Dropdown.Menu className={styles.DropdownMenu}>
      <Dropdown.Item
        onClick={handleEditProfile}
        className={`text-white ${styles.DropdownItem}`}
      >
        <span>Edit Profile</span>
        <FontAwesomeIcon icon={faUserEdit} className={styles.Icon} />
      </Dropdown.Item>
      <Dropdown.Item
        onClick={handleChangeProfileImage}
        className={styles.DropdownItem}
      >
        <span>Profile Image</span>
        <FontAwesomeIcon icon={faImage} className={styles.Icon} />
      </Dropdown.Item>
      <Dropdown.Item
        onClick={handleChangeUsername}
        className={styles.DropdownItem}
      >
        <span>Change Username</span>
        <FontAwesomeIcon icon={faUser} className={styles.Icon} />
      </Dropdown.Item>
      <Dropdown.Item
        onClick={handleChangePassword}
        className={styles.DropdownItem}
      >
        <span>Change Password</span>
        <FontAwesomeIcon icon={faLock} className={styles.Icon} />
      </Dropdown.Item>
      <Dropdown.Item
        onClick={handleDeleteAccount}
        className={styles.DropdownItem}
      >
        <span>Delete Account</span>
        <FontAwesomeIcon icon={faUserSlash} className={styles.Icon} />
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

export { EditDeleteDropdown, ProfileActionsDropdown };
