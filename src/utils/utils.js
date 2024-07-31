import { axiosReq } from '../api/axiosDefaults';
import PropTypes from 'prop-types';

// Constants for profile properties
const PROFILE_ID = 'id';
const FOLLOWERS_COUNT = 'followers_count';
const FOLLOWING_COUNT = 'following_count';
const IS_OWNER = 'is_owner';

export const fetchMoreData = async (resource, setResource) => {
  if (!resource.next) return;

  try {
    const { data } = await axiosReq.get(resource.next);
    const { next, results } = data;
    const existingPostIds = new Set(resource.results.map((post) => post.id));
    const newResults = results.filter((post) => !existingPostIds.has(post.id));

    setResource((prevResource) => ({
      ...prevResource,
      next,
      results: [...prevResource.results, ...newResults],
    }));
  } catch (err) {
    if (err.response) {
      console.error(
        'Server responded with an error:',
        err.response.status,
        err.response.data
      );
    } else if (err.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Error setting up request:', err.message);
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
  if (profile[PROFILE_ID] === clickedProfile[PROFILE_ID]) {
    return {
      ...profile,
      [FOLLOWERS_COUNT]: profile[FOLLOWERS_COUNT] + 1,
      following_id,
    };
  } else if (profile[IS_OWNER]) {
    return { ...profile, [FOLLOWING_COUNT]: profile[FOLLOWING_COUNT] + 1 };
  } else {
    return profile;
  }
};

updateProfileOnFollow.propTypes = {
  profile: PropTypes.object.isRequired,
  clickedProfile: PropTypes.object.isRequired,
  following_id: PropTypes.number.isRequired,
};

/* Helper function to update profile data when a user is unfollowed */
export const updateProfileOnUnfollow = (profile, clickedProfile) => {
  if (profile[PROFILE_ID] === clickedProfile[PROFILE_ID]) {
    return {
      ...profile,
      [FOLLOWERS_COUNT]: profile[FOLLOWERS_COUNT] - 1,
      following_id: null,
    };
  } else if (profile[IS_OWNER]) {
    return { ...profile, [FOLLOWING_COUNT]: profile[FOLLOWING_COUNT] - 1 };
  } else {
    return profile;
  }
};

updateProfileOnUnfollow.propTypes = {
  profile: PropTypes.object.isRequired,
  clickedProfile: PropTypes.object.isRequired,
};
