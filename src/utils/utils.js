import { axiosReq } from '../api/axiosDefaults';

export const fetchMoreData = async (resource, setResource) => {
  if (!resource.next) return;
  try {
    const { data } = await axiosReq.get(resource.next);
    const { next, results } = data;
    setResource((prevResource) => ({
      ...prevResource,
      next,
      results: [
        ...prevResource.results,
        ...results.filter(
          (cur) =>
            !prevResource.results.some((accResult) => accResult.id === cur.id),
        ),
      ],
    }));
  } catch (err) {
    console.error('Error fetching more data:', err);
  }
};
