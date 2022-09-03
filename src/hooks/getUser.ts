const lsTest = () => {
  if (typeof localStorage === 'object') {
    try {
      localStorage.setItem('localStorage', '1')
      localStorage.removeItem('localStorage')
      return true
    } catch (e) {
      Storage.prototype._setItem = Storage.prototype.setItem
      Storage.prototype.setItem = function () {}
      return false
    }
  }
}
const getUser = () => {
  if (lsTest() === false) {
    console.log('no local storage')
    return null
    window.location = '/no-local-storage' as any
  }
  try {
    const user = JSON.parse(localStorage.getItem('user') as string)
    if (user !== null && user !== undefined && user !== '') {
      return user
    }
    return null
  } catch (error) {
    return null
  }
}
export default getUser
