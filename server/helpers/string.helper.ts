class StringHelper {
  capitalizeFirstLetter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
}

const stringHelper = new StringHelper()

export default stringHelper