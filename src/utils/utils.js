import { axiosReq } from '../api/axiosDefaults';
import PropTypes from 'prop-types';

// Constants for profile properties
const PROFILE_ID = 'id';
const FOLLOWERS_COUNT = 'followers_count';
const FOLLOWING_COUNT = 'following_count';
const IS_OWNER = 'is_owner';

// Function to fetch more data for infinite scrolling
export const fetchMoreData = async (resource, setResource) => {
  if (!resource || !setResource || !resource.next) {
    return;
  }

  try {
    const { data } = await axiosReq.get(resource.next);
    const { next, results } = data || {};
    const existingPostIds = new Set(resource.results.map((post) => post?.id));
    const newResults =
      results?.filter((post) => post?.id && !existingPostIds.has(post.id)) ||
      [];

    setResource((prevResource) => ({
      ...(prevResource || {}),
      next,
      results: [...(prevResource?.results || []), ...newResults],
    }));
  } catch (err) {
    if (err?.response) {
      const { status, data } = err.response;
      console.error('Server responded with an error:', status, data);
    } else if (err?.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Error setting up request:', err?.message);
    }
  }
};

fetchMoreData.propTypes = {
  resource: PropTypes.shape({
    next: PropTypes.string,
    results: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  setResource: PropTypes.func.isRequired,
};

/* Helper function to update profile data when a user is followed */
export const updateProfileOnFollow = (
  profile,
  clickedProfile,
  following_id
) => {
  if (!profile || !clickedProfile || !following_id) {
    throw new Error('Invalid arguments');
  }

  const updatedProfile = { ...profile };

  if (updatedProfile[PROFILE_ID] === clickedProfile[PROFILE_ID]) {
    updatedProfile[FOLLOWERS_COUNT] =
      (updatedProfile[FOLLOWERS_COUNT] || 0) + 1;
    updatedProfile.following_id = following_id;
  } else if (updatedProfile[IS_OWNER]) {
    updatedProfile[FOLLOWING_COUNT] =
      (updatedProfile[FOLLOWING_COUNT] || 0) + 1;
  }

  return updatedProfile;
};

updateProfileOnFollow.propTypes = {
  profile: PropTypes.object.isRequired,
  clickedProfile: PropTypes.object.isRequired,
  following_id: PropTypes.number.isRequired,
};

/* Helper function to update profile data when a user is unfollowed */
export const updateProfileOnUnfollow = (profile, clickedProfile) => {
  if (!profile || !clickedProfile) {
    throw new Error('Invalid arguments');
  }

  if (profile[PROFILE_ID] === clickedProfile[PROFILE_ID]) {
    const updatedProfile = { ...profile };
    updatedProfile[FOLLOWERS_COUNT] =
      (updatedProfile[FOLLOWERS_COUNT] || 1) - 1;
    updatedProfile.following_id = null;
    return updatedProfile;
  } else if (profile[IS_OWNER]) {
    const updatedProfile = { ...profile };
    updatedProfile[FOLLOWING_COUNT] =
      (updatedProfile[FOLLOWING_COUNT] || 1) - 1;
    return updatedProfile;
  } else {
    return profile;
  }
};

updateProfileOnUnfollow.propTypes = {
  profile: PropTypes.object.isRequired,
  clickedProfile: PropTypes.object.isRequired,
};
