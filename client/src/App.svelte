<style>
  .app {
    display: flex;
    flex-wrap: wrap;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
      'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  nav {
    margin: 2em;
    display: flex;
    flex-direction: column;
    flex: 1 0;
    position: relative;
  }

  .content {
    margin: 2em;
    flex: 999 1 600px;
    min-height: 600px;
  }
</style>

<script>
  import { Router, Route, Navigate } from 'svelte-router-spa'
  import { routes } from './routes'
  import 'bulma/css/bulma.css'
  import { Snackbar } from 'svelma'
  import { requests } from './stores'

  $: {
    //todo: get url from env
    const loading = Snackbar.create({
      message: '...loading data',
      type: 'is-white',
      position: 'is-top-right',
      duration: 100000
    })

    fetch('http://localhost:5000/requests')
      .then(res => res.json())
      .then(requests => {
        return requests.map(request => {
          request.json = JSON.parse(request.json)
          return request
        })
      })
      .then(data => {
        requests.set(data)
        loading.$destroy()
      })
      .catch(error =>
        Snackbar.create({
          message: error.message,
          type: 'is-danger',
          actionText: 'retry',
          position: 'is-top-right'
        })
      )
  }
  export let currentRoute
</script>

<div class="app">
  <nav>
    <ul>
      <li>
        <Navigate to="/">Home</Navigate>
      </li>
      <li>
        <Navigate to="/browse">Browse</Navigate>
      </li>
      <li>
        <Navigate to="/new">New</Navigate>
      </li>
      <li>
        <Navigate to="/map">Map</Navigate>
      </li>
    </ul>
  </nav>
  <div class="content">
    <Router {currentRoute} {routes} />
  </div>
</div>
