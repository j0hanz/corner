import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosRes, axiosReq } from '../api/axiosDefaults';
import { updateProfileOnFollow, updateProfileOnUnfollow } from '../utils/utils';
import { useCurrentUser } from './CurrentUserContext';

// Create contexts for profile data and setter functions
const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

// Custom hooks to use the profile data and setter functions
export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
  });

  const currentUser = useCurrentUser();

  // Function to follow a user
  const followUser = async (clickedProfile) => {
    try {
      const { data } = await axiosRes.post('/followers/', {
        followed: clickedProfile.id,
      });

      // Update the profile data state after following a user
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            updateProfileOnFollow(profile, clickedProfile, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            updateProfileOnFollow(profile, clickedProfile, data.id)
          ),
        },
      }));
    } catch (err) {
      console.error('Failed to follow the profile:', err);
    }
  };

  // Function to unfollow a user
  const unfollowUser = async (clickedProfile) => {
    try {
      await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);

      // Update the profile data state after unfollowing a user
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            updateProfileOnUnfollow(profile, clickedProfile)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            updateProfileOnUnfollow(profile, clickedProfile)
          ),
        },
      }));
    } catch (err) {
      console.error('Failed to unfollow the profile:', err);
    }
  };

  // Fetch popular profiles when the component mounts or currentUser changes
  useEffect(() => {
    const fetchPopularProfiles = async () => {
      try {
        const { data } = await axiosReq.get(
          '/users/?ordering=-followers_count'
        );
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data,
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchPopularProfiles();
  }, [currentUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={{ followUser, unfollowUser }}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
