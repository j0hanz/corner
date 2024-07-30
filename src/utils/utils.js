import { axiosReq } from '../api/axiosDefaults';

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
    console.error('Error fetching more data:', err);
  }
};

/* Helper function to update profile data when a user is followed */
export const followHelper = (profile, clickedProfile, followingId) => {
  if (profile.id === clickedProfile.id) {
    return {
      ...profile,
      followers_count: profile.followers_count + 1,
      following_id: followingId,
    };
  }
  if (profile.is_owner) {
    return {
      ...profile,
      following_count: profile.following_count + 1,
    };
  }
  return profile;
};

/* Helper function to update profile data when a user is unfollowed */
export const unfollowHelper = (profile, clickedProfile) => {
  if (profile.id === clickedProfile.id) {
    return {
      ...profile,
      followers_count: profile.followers_count - 1,
      following_id: null,
    };
  }
  if (profile.is_owner) {
    return {
      ...profile,
      following_count: profile.following_count - 1,
    };
  }
  return profile;
};
