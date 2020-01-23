const api_host = API_HOST

export default function(route, params) {
  console.log(`connecting to ${api_host}`)
  return fetch(`${api_host}/${route}`, params).then(res => res.json())
}
