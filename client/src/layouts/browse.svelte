<style>

</style>

<script>
  import inObj from '../utils/inObj'
  import Select from 'svelte-select'
  import { Navigate } from 'svelte-router-spa'
  import { requests } from '../stores'

  $: requestsList = $requests.map(request => {
    request.name = inObj(request.json, 'Request/Issue', '<no name>')
    request.href = `/browse/request/${request.id}`
    return request
  })
</script>

<h3 class="title is-3">Browse</h3>
<h6 class="subtitle is-6">Search request by different filters, then edit</h6>

<form></form>

<ul>
  {#each requestsList as item (item.id)}
    <li>
      <Navigate to="{item.href}">{item.name}</Navigate>
    </li>
  {/each}
</ul>
