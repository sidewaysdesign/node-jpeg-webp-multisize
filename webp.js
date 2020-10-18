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
  const sizePath = [rootOutput, size].join('/')
  if (!fs.existsSync(sizePath)) fs.mkdirSync(sizePath)

  const pluginArgs = {
    quality: config.quality.webp,
    resize: { width: size, height: 0 }
  }
  const curPath = __dirname + `/${config.destination.trim('/')}/${size}`
  const processedFiles = imagemin([`${config.source}/*.{jpg,png}`], {
    destination: curPath,
    plugins: [imageminWebp(pluginArgs)]
  }).then(() => {
    const fileSet = fs.readdirSync(sizePath).filter(o => o.endsWith(`.webp`))
    fileSet.forEach(o => {
      const nameWithSize = o.replace(/(\.webp)$/i, `-${size}w$1`)
      fs.rename([curPath, o].join('/'), [curPath, nameWithSize].join('/'), function (err) {})
    })
  })
})

const openBuild = execSync(`open ${rootOutput}`)
