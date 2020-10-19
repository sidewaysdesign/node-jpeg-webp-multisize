let config = {}
config.sizes = [0, 360, 600, 1024] /* include 0 value to copy files at original size */
config.source = 'images'
config.destination = 'output'
config.quality = { webp: 50, jpeg: 60 }

module.exports = config
