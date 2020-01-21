import { readable, writable, derived } from 'svelte/store'

export const count = writable(0)

function createRequests() {
  const { subscribe, set, update } = writable([])
  return {
    subscribe,
    set,
    reset: () => set([])
  }
}

export const requests = createRequests()

export const requestsPoints = derived(requests, $requests => {
  return {
    type: 'FeatureCollection',
    features: $requests
      .filter(request => request.location)
      .reduce((features, request) => {
        return [
          ...features,
          {
            type: 'Feature',
            properties: {
              id: request.id,
              ...request.json
            },
            geometry: {
              type: request.location.type,
              coordinates: request.location.coordinates.reverse()
            }
          }
        ]
      }, [])
  }
})
