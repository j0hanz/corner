import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useSetProfileData } from '../../contexts/ProfileDataContext';
import { Button } from 'react-bootstrap';
import styles from './styles/Profile.module.css';
import Avatar from '../../components/Avatar';

const Profile = (props) => {
  const { profile, imageSize = 45 } = props; // Destructure profile and imageSize from props
  const { id, following_id, image_url, owner } = profile; // Destructure fields from profile
  const currentUser = useCurrentUser(); // Get the current user from context
  const is_owner = currentUser?.username === owner; // Check if the current user is the owner of the profile

  const { followUser, unfollowUser } = useSetProfileData(); // Get follow and unfollow functions from context

  return (
    <div className="d-flex">
      <div className="d-flex flex-column align-items-center">
        <Link className="align-self-center mb-1" to={`/users/${id}`}>
          <Avatar
            src={image_url}
            alt={`${owner}'s profile`}
            height={imageSize}
            className={styles.ProfileImage}
          />
        </Link>
        <strong className={`my-1 text-white-50 ${styles.WordBreak}`}>
          {owner}
        </strong>
        <div className="d-flex"></div>
        {currentUser &&
          !is_owner &&
          (following_id ? (
            <Button
              variant="secondary text-white btn-sm"
              className={`${styles.Button} ${styles.unfollowButton}`}
              onClick={() => unfollowUser(profile)}
            >
              unfollow
            </Button>
          ) : (
            <Button
              variant="primary text-white btn-sm"
              className={`${styles.Button} ${styles.followButton}`}
              onClick={() => followUser(profile)}
            >
              follow
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Profile;
