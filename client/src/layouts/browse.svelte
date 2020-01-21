<style>

</style>

<script>
  import inObj from '../utils/inObj'
  import Select from 'svelte-select'
  import { Navigate } from 'svelte-router-spa'
  const requests = fetchRequests()

  async function fetchRequests() {
    return await fetch('http://localhost:5000/requests')
      .then(res => res.json())
      .then(requests => {
        return requests.map(request => {
          request.json = JSON.parse(request.json)
          request.name = inObj(request.json, 'Request/Issue', '<no name>')
          request.href = `/browse/request/${request.id}`
          return request
        })
      })
  }
</script>

<h3 class="title is-3">Browse</h3>
<h6 class="subtitle is-6">Search request by different filters, then edit</h6>

<form></form>

{#await requests}
  <p>...loading</p>
{:then items}
  <ul>
    {#each items as item (item.id)}
      <li>
        <Navigate to="{item.href}">{item.name}</Navigate>
      </li>
    {/each}
  </ul>
{:catch error}
  <p>{error.message}</p>
{/await}
