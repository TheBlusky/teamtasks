/* global fetch */
const getCSRFToken = () => (
  document.cookie
    .split('; ')
    .filter(c => (c.startsWith('csrftoken=')))
    .map(c => (c.split('=')[1]))
    .reduce((res, item) => {
      res['X-CSRFToken'] = item
      return res
    }, {})
)

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const customFetch = async (url, getParams = {}, method = 'GET', data = false, slow = false) => {
  if (slow) await sleep(2000)
  const tmpUrl = new URL('http://foo/')
  Object
    .keys(getParams || {})
    .forEach(key =>
      getParams[key] && tmpUrl.searchParams.append(key, getParams[key])
    )
  const body = data ? {body: JSON.stringify(data)} : {}
  const response = await fetch(`${url}${tmpUrl.search}`, {
    method: method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getCSRFToken()
    },
    ...body
  })
  return response
}

export default customFetch
