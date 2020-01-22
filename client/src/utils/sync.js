import { Snackbar } from 'svelma'
import { requests, organizations, contacts } from '../stores'

export default async function sync() {
  //todo: get url from env
  const SYNC_URL = 'http://localhost:5000'

  const loading = Snackbar.create({
    message: '...loading data',
    type: 'is-white',
    position: 'is-top-right',
    duration: 100000
  })

  //get all
  const syncItems = [
    { id: 'requests', store: requests },
    { id: 'organizations', store: organizations },
    { id: 'contacts', store: contacts }
  ]

  const syncFetches = syncItems.map(item =>
    fetch(`${SYNC_URL}/${item.id}`)
      .then(res => res.json())
      .then(data => {
        return data.map(i => {
          i.json = JSON.parse(i.json)
          return i
        })
      })
      .then(data => {
        item.store.set(data)
      })
  )

  await Promise.all(syncFetches)
    .then(() => {
      loading.$destroy()
    })
    .catch(error => {
      loading.$destroy()
      Snackbar.create({
        message: error.message,
        type: 'is-danger',
        actionText: 'retry',
        position: 'is-top-right'
      })
    })
}
