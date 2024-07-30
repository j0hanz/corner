import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosReq } from '../api/axiosDefaults';
import { followHelper, unfollowHelper } from '../utils/utils';

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data } = await axiosReq.get('/users/');
        setProfiles(data);
      } catch (err) {
        console.error('Error fetching profiles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const followUser = async (userId) => {
    try {
      const { data } = await axiosReq.post('/followers/', {
        followed_user: userId,
      });
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          followHelper(profile, { id: userId }, data.id)
        )
      );
    } catch (err) {
      if (err.response?.data?.detail === 'possible duplicate') {
        console.log('User is already following this profile.');
      } else {
        console.error(
          'Error following user:',
          err.response?.data || err.message
        );
      }
    }
  };

  const unfollowUser = async (followerId) => {
    try {
      await axiosReq.delete(`/followers/${followerId}/`);
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          unfollowHelper(profile, { id: followerId })
        )
      );
    } catch (err) {
      console.error('Error unfollowing user:', err);
    }
  };

  useEffect(() => {
    const fetchPopularProfiles = async () => {
      try {
        const { data } = await axiosReq.get(
          '/users/?ordering=-followers_count'
        );
        setProfiles(data.results);
      } catch (err) {
        console.error('Error fetching popular profiles:', err);
      }
    };

    fetchPopularProfiles();
  }, []);

  return (
    <ProfileDataContext.Provider value={{ profiles, loading }}>
      <SetProfileDataContext.Provider value={{ followUser, unfollowUser }}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
