const path = require('path')
const {readdirSync} = require('fs')
const fse = require('fs-extra')

copyLand(process.argv[2])

function copyLand(dirPath, defaultTemplate = 'ru') {
  const dirName = path.basename(dirPath)
  const homeDir = path.dirname(dirPath)

  const innerDirs = getDirectories(homeDir)
      .filter(dir => dir !== dirName)

  if (innerDirs.length === 0) {
    console.log('Существует только 1 папка!!!')
    return
  }

  const template = setTemplate(innerDirs, defaultTemplate)
  const copyFrom = path.resolve(homeDir, template)
  const copyTo = path.resolve(homeDir, dirName)

  copyDir(copyFrom, copyTo)
}

function copyDir(from, to) {
  fse.copy(from, to, {overwrite: false}, err => {
    if (err) return console.error(err)
    console.log(`Содержимое ${path.basename(from)} скопировано в текущую директорию!`)
  })
}

function setTemplate(templates, defaultTemplate) {
  if (templates.includes(defaultTemplate)) {
    return defaultTemplate
  } else {
    return templates[0]
  }
}

function getDirectories(source) {
  return readdirSync(source, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
}
