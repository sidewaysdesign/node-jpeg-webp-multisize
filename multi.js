const resizer = require('responsive-images-resizer')
const config = require('./config')
const fs = require('fs')
const mv = require('mv')

resizer(`./${config.source}`, './' + config.destination, config.sizes)
  .then(() => {
    const fileSet = fs.readdirSync('./').filter(o => o.startsWith(`${config.destination}\\`))
    fileSet.forEach(o =>
      mv(
        './' + o,
        o
          .split('\\')
          .join('/')
          .replace(/(\.[a-z|A-Z]{1,})$/i, `w$1`),
        { mkdirp: true },
        function (err) {}
      )
    )
  })
  .catch(err => {
    console.log('Error:', err)
  })
