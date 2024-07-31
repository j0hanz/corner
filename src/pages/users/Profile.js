import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useSetProfileData } from '../../contexts/ProfileDataContext';
import { Button } from 'react-bootstrap';
import styles from './styles/Profile.module.css';

const Profile = (props) => {
  const { profile, imageSize = 45 } = props;
  const { id, following_id, image_url, owner } = profile;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const { followUser, unfollowUser } = useSetProfileData();

  return (
    <div className="d-flex align-items-center">
      <div className="d-flex flex-column align-items-center">
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <img
            src={image_url}
            alt={`${owner}'s profile`}
            height={imageSize}
            className={styles.ProfileImage}
          />
        </Link>
        <strong className={`my-1 ${styles.WordBreak}`}>{owner}</strong>
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
