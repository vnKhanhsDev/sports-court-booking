export const localStorageUtil = {
    set: (key: string, value: unknown) => {
      try {
        const serializedValue = JSON.stringify(value)
        localStorage.setItem(key, serializedValue)
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
  
    get: <T = unknown>(key: string): T | null => {
      try {
        const value = localStorage.getItem(key)
        return value ? (JSON.parse(value) as T) : null
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error)
        return null
      }
    },
  
    remove: (key: string) => {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error)
      }
    },
  
    clear: () => {
      try {
        localStorage.clear()
      } catch (error) {
        console.error("Error clearing localStorage:", error)
      }
    },
  }