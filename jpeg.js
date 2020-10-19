const resizer = require('responsive-images-resizer')
const config = require('./config')
const fs = require('fs')
const mv = require('mv')

const rootSource = __dirname + `/images/`
const rootDest = __dirname + `/${config.destination.trim('/')}/`

let copyOriginalsFlag = false
if (!fs.existsSync(rootDest)) fs.mkdirSync(rootDest)
if (config.sizes.includes(0)) {
  copyOriginalsFlag = true
  config.sizes.splice(config.sizes.indexOf(0), 1) /* remove 0 from size array and handle original size copy separately */
}

resizer(`./${config.source}`, './' + config.destination, config.sizes)
  .then(() => {
    /* copy filenames with incorrect slash type into corresponding named size destination subfolders */
    const fileSet = fs.readdirSync('./').filter(o => o.startsWith(`${config.destination}\\`))
    fileSet.forEach(o =>
      mv(
        './' + o,
        o
          .split('\\')
          .join('/')
          .replace(/(\.[a-z|A-Z]{1,})$/i, `w$1`),
        { mkdirp: false },
        function (err) {}
      )
    )
    if (copyOriginalsFlag) copyOriginals() /* copy original files to destination folder */
    console.log('All done!')
  })
  .catch(err => {
    console.log('Error:', err)
  })

const copyOriginals = () => {
  const fileSet = fs.readdirSync(rootSource).filter(o => o.endsWith(`.jpg`) || o.endsWith(`.png`))
  if (fileSet) {
    fileSet.forEach(f => {
      fs.copyFileSync(rootSource + f, rootDest + f, err => {
        console.log('Error during non-resized copy')
      })
    })
  }
}
