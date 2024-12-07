export const getResponseCounts = `
  query MyQuery {
    getResponseCounts {
      datetime_counts
      response_counts
    }
  }
`;


export const getLocations = `
  query GetLocations($categoryLocation: String!) {
    getLocations(categoryLocation: $categoryLocation) {
      name
      rating
      reviews
      category
      address
      hours
      services
      latitude
      longitude
      images
      google_maps_url
    }
  }
`;

