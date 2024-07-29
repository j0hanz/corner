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
