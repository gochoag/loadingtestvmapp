export function createUserFromEmail(email) {
  const identity = email.trim()
  const alias = identity.split('@')[0].replace(/[._-]/g, ' ')
  const displayName = alias
    .split(' ')
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')

  return {
    email: identity,
    name: displayName || 'Usuario',
  }
}
