import { Snackbar } from 'svelma'
import { requests, organizations, contacts } from '../stores'
import API from './api'

export default async function sync() {
  //todo: get url from env
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
    API(`api/${item.id}`)
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
