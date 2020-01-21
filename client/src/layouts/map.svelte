<script>
  import Leaflet from '../components/leaflet.svelte'
  import { requestsPoints } from '../stores.js'
</script>

<h3 class="title is-3">Map</h3>
<h6 class="subtitle is-6">View locations of requests</h6>
<Leaflet data="{$requestsPoints}" />
