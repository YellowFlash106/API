export const readJsonStorage = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key)

    if (raw === null || raw === undefined || raw === '' || raw === 'undefined' || raw === 'null') {
      return fallback
    }

    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const writeJsonStorage = (key, value) => {
  if (value === undefined) {
    localStorage.removeItem(key)
    return null
  }

  const serialized = JSON.stringify(value)

  if (serialized === undefined) {
    localStorage.removeItem(key)
    return null
  }

  localStorage.setItem(key, serialized)
  return value
}

export const getStoredUser = () => readJsonStorage('user', {})