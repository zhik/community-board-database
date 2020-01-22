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
  import sync from './utils/sync'

  $: sync()

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
