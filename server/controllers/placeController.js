import axios from 'axios';

export const searchPlaces = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query is required' });

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          query: q,
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    const places = response.data.results.map((place) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    }));

    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};