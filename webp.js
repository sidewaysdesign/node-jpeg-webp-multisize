const imagemin = require('imagemin')
const imageminWebp = require('imagemin-webp')
const { execSync } = require('child_process')
const config = require('./config')
const fs = require('fs')
const mv = require('mv')

const path = require('path')

const rootOutput = __dirname + `/${config.destination.trim('/')}/`

if (!fs.existsSync(rootOutput)) fs.mkdirSync(rootOutput)

config.sizes.forEach(size => {
  const sizePath = size !== 0 ? [rootOutput, size].join('/') : rootOutput
  if (!fs.existsSync(sizePath) && size !== 0) fs.mkdirSync(sizePath)
  const pluginArgs = {
    quality: config.quality.webp,
    resize: { width: size, height: 0 }
  }
  if (!size) delete pluginArgs.resize
  const curPath = __dirname + `/${config.destination.trim('/')}${size ? `/${size}` : ''}`
  // console.log('curPath ->', curPath)
  const processedFiles = imagemin([`${config.source}/*.{jpg,png}`], {
    destination: curPath,
    plugins: [imageminWebp(pluginArgs)]
  }).then(() => {
    const fileSet = fs.readdirSync(sizePath).filter(o => o.endsWith(`.webp`))
    fileSet.forEach(o => {
      const nameWithSize = o.replace(/(\.webp)$/i, size !== 0 ? `-${size}w$1` : '$1')
      fs.rename([curPath, o].join('/'), [curPath, nameWithSize].join('/'), function (err) {})
    })
  })
})

const openBuild = execSync(`open ${rootOutput}`)
