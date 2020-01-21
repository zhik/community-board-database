<style>
  #map {
    width: 100%;
    height: 100%;
  }
  :global(.leaflet-popup-content) {
    overflow: auto;
    max-height: 200px;
    word-wrap: break-word;
    line-height: 0em;
  }
  :global(.leaflet-popup-content p) {
    line-height: 1.2em;
    margin: 3px 0 !important;
  }
</style>

<script>
  import { onMount } from 'svelte'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
  import markerIcon from 'leaflet/dist/images/marker-icon.png'
  import markerShadow from 'leaflet/dist/images/marker-shadow.png'

  //fix for markers not showing up
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
  })

  export let data = {
    type: 'FeatureCollection',
    features: []
  }

  let map
  let layer
  let container

  onMount(() => {
    map = L.map(container, {}).setView([40.7128, -74.0034], 13)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map)
  })

  $: if (data.features.length && map) {
    if (layer) map.removeLayer(layer)

    layer = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        const table = Object.keys(feature.properties)
          .map(function(key) {
            return `<p><b>${key}</b>: ${feature.properties[key]}</p>`
          })
          .join('')
        layer.bindPopup(table)
      }
    }).addTo(map)

    const group = new L.featureGroup([layer])
    map.fitBounds(group.getBounds())
  }
</script>

<div id="map" bind:this="{container}"></div>
