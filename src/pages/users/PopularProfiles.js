import React from 'react';
import { Container } from 'react-bootstrap';
import { useProfileData } from '../../contexts/ProfileDataContext';
import Profile from './Profile';
import Asset from '../../components/Asset';
import styles from './styles/PopularProfiles.module.css';

/* PopularProfiles component to display a list of popular profiles */
const PopularProfiles = () => {
  const { popularProfiles } = useProfileData();
  const { results } = popularProfiles;

  const renderProfiles = () => (
    <div className={styles.ProfilesSection}>
      <hr />
      <div className={`text-center py-3 ${styles.Header}`}>
        <h3>Most Followed Profiles</h3>
      </div>
      <div
        className={`d-flex flex-wrap justify-content-around bg-dark py-4 ${styles.PopularProfilesBorder}`}
      >
        {results.slice(0, 4).map((profile) => (
          <Profile key={profile.id} profile={profile} />
        ))}
      </div>
      <hr />
    </div>
  );

  return (
    <Container className="px-0">
      {results.length ? (
        renderProfiles()
      ) : (
        <div className="d-flex justify-content-center">
          <Asset spinner />
        </div>
      )}
    </Container>
  );
};

export default PopularProfiles;
