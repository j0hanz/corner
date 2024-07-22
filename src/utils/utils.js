import { axiosReq } from '../api/axiosDefaults';

/**
 * Fetches more data from a paginated API resource and updates the state with the new data.
 * @param {Object} resource - The current resource state containing `next` URL and `results`.
 * @param {Function} setResource - The state setter function for updating the resource state.
 */
export const fetchMoreData = async (resource, setResource) => {
  if (!resource.next) return;

  try {
    const { data } = await axiosReq.get(resource.next);

    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: [
        ...prevResource.results,
        ...data.results.filter(
          (cur) =>
            !prevResource.results.some((accResult) => accResult.id === cur.id),
        ),
      ],
    }));
  } catch (err) {
    console.error('Error fetching more data:', err);
  }
};
