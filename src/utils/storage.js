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

    const gistData = JSON.parse(fileContent)

    const merge = (local, remote) => {
      const map = new Map()
      ;[...(remote || []), ...(local || [])].forEach(e => map.set(e.id, e))
      return Array.from(map.values()).sort((a, b) => {
        const aKey = (a.date || '') + 'T' + (a.time || '00:00')
        const bKey = (b.date || '') + 'T' + (b.time || '00:00')
        return bKey > aKey ? 1 : -1
      })
    }

    const mergeOnePerDate = (local, remote) => {
      const all = merge(local, remote)
      const dateMap = new Map()
      all.forEach(e => { if (!dateMap.has(e.date) || e.id > dateMap.get(e.date).id) dateMap.set(e.date, e) })
      return Array.from(dateMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    const merged = {
      daily: merge(localData.daily, gistData.daily),
      weekly: mergeOnePerDate(localData.weekly, gistData.weekly),
      journal: merge(localData.journal, gistData.journal),
      visits: merge(localData.visits, gistData.visits),
    }
    saveToLocalStorage(merged)
    return merged
  } catch (err) {
    console.warn('Could not load from Gist, using localStorage:', err)
    return localData
  }
}
