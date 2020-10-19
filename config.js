/**
 * - Include 0 value in sizes array to copy files at original size *
 * - Recommend adding source & destination names manually to .gitignore *
 */
const config = {
  sizes: [0, 360, 600, 1024],
  source: 'images',
  destination: 'output',
  quality: { webp: 50, jpeg: 60 }
}

module.exports = config
