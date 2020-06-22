const package = require('../package.json')
const Calver = require('calver')
 
// initiate a new versioner by specifiying a format and optional version
const calver = new Calver('YY.MM.MICRO', package.version)
 
// get the current version
const currentVersion = calver.get()
 
// increment the current version
calver.inc()
 
// get current version
calver.get()
 
console.log(
  calver.toSemver()
)
