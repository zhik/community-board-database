import { readable, writable, derived } from 'svelte/store'

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
  function reverse(array) {
    var output = [],
      i
    for (i = 0; i < array.length; i++) {
      output.unshift(array[i])
    }

    return output
  }

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
              coordinates: reverse(request.location.coordinates)
            }
          }
        ]
      }, [])
  }
})

function createTagStore() {
  const { subscribe, set, update } = writable([])
  return {
    subscribe,
    set,
    reset: () => set([])
  }
}

export const organizations = createTagStore()
export const contacts = createTagStore()
