export function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('bills-health-data')
    if (saved) return JSON.parse(saved)
  } catch (e) {}
  return { daily: [], weekly: [], journal: [], visits: [] }
}

export function saveToLocalStorage(data) {
  localStorage.setItem('bills-health-data', JSON.stringify(data))
}

export async function pushToGist(gistId, token, data) {
  try {
    await fetch('https://api.github.com/gists/' + gistId, {
      method: 'PATCH',
      headers: { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: { 'bills-health-data.json': { content: JSON.stringify(data, null, 2) } }
      })
    })
  } catch (err) {
    console.warn('Auto-sync to Gist failed:', err)
  }
}

export async function syncToGist(gistId, token, data) {
  const res = await fetch('https://api.github.com/gists/' + gistId, {
    method: 'PATCH',
    headers: { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description: "Bill's Health Tracker Data — Last updated " + new Date().toLocaleString(),
      files: { 'bills-health-data.json': { content: JSON.stringify(data, null, 2) } }
    })
  })
  if (!res.ok) throw new Error('Gist sync failed: ' + res.status)
}

export async function loadFromGist(gistId, token, localData) {
  try {
    const headers = token ? { 'Authorization': 'token ' + token } : {}
    const res = await fetch('https://api.github.com/gists/' + gistId, { headers })
    if (!res.ok) return localData
    const gist = await res.json()
    const fileContent = gist.files['bills-health-data.json']?.content
    if (!fileContent) return localData

    // Gist is the source of truth — use it directly.
    // localStorage is only a fallback for when the gist is unreachable.
    const gistData = JSON.parse(fileContent)
    const canonical = {
      daily:   gistData.daily   || [],
      weekly:  gistData.weekly  || [],
      journal: gistData.journal || [],
      visits:  gistData.visits  || [],
    }
    saveToLocalStorage(canonical)
    return canonical
  } catch (err) {
    console.warn('Could not load from Gist, using localStorage:', err)
    return localData
  }
}
