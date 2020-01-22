<style>
  .map-div {
    height: 20em;
  }
</style>

<script>
  import Leaflet from '../components/leaflet.svelte'
  import Select from 'svelte-select'

  export let label
  export let id
  export let value
  export let initLocation

  let selectedValue
  let placeholder = 'Search an address'

  let geojson = {
    type: 'FeatureCollection',
    features: []
  }

  $: {
    if (initLocation && initLocation.geometry) {
      geojson = {
        type: 'FeatureCollection',
        features: [initLocation]
      }
    }
    if (initLocation && initLocation.properties) {
      placeholder = initLocation.properties.label
    }
  }

  $: {
    if (selectedValue && 'properties' in selectedValue) {
      value = selectedValue.properties.label
      geojson = {
        type: 'FeatureCollection',
        features: [selectedValue]
      }
    }
  }

  const optionIdentifier = 'id'
  const getOptionLabel = option => option.properties.label
  const getSelectionLabel = option => option.properties.label

  function loadOptions(searchTerm) {
    if (searchTerm.length > 1) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', `https://geosearch.planninglabs.nyc/v1/search?text=${searchTerm}`)
        xhr.send()

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setTimeout(resolve(JSON.parse(xhr.response)), 2000)
          } else {
            reject()
          }
        }
      }).then(data => data.features)
    }
    return []
  }
</script>

<div class="map-div">
  <Leaflet data="{geojson}" zoom="{15}" />
</div>

<div class="field" style="margin-top: 0.8rem;">
  <label for="{id}" class="label">{label}</label>
  <Select
    {id}
    {placeholder}
    {loadOptions}
    {optionIdentifier}
    {getOptionLabel}
    {getSelectionLabel}
    bind:selectedValue
    noOptionsMessage="No addresses found"
  />
</div>
