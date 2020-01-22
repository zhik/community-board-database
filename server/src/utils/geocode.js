import fetch from 'node-fetch'

export default function(address) {
  return fetch(`https://geosearch.planninglabs.nyc/v1/search?text=${address}`)
    .then(res => res.json())
    .then(data => {
      if (data.features.length > 0) {
        return {
          type: 'Point',
          coordinates: data.features[0].geometry.coordinates
        }
      }
      return null
    })
}
