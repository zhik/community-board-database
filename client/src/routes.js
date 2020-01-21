import Index from './layouts/index.svelte'
import NotFound from './layouts/notFound.svelte'
import Browse from './layouts/browse.svelte'
import Edit from './layouts/edit.svelte'
import New from './layouts/new.svelte'
import MapC from './layouts/map.svelte'

const routes = [
  { name: '/', component: Index },
  { name: '404.html', component: NotFound },
  {
    name: 'browse',
    nestedRoutes: [
      { name: 'index', component: Browse },
      { name: 'request/:id', component: Edit }
    ]
  },
  { name: 'new', component: New },
  { name: 'map', component: MapC }
]

export { routes }
