export async function hashPassword(password) {
  if (!crypto.subtle) {
    alert('This page requires a secure connection (HTTPS).')
    throw new Error('crypto.subtle unavailable')
  }
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
