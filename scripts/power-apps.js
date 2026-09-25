#!/usr/bin/env node
const { execSync } = require('child_process')
const path = require('path')

const args = process.argv.slice(2)
const command = args[0]
const projectDir = path.join(__dirname, '..', 'project-tracker')
const pac = 'C:\\Users\\Dell\\AppData\\Local\\Microsoft\\PowerAppsCLI\\pac.cmd'

if (command === 'push') {
  console.log('Building...')
  execSync('npm run build', { cwd: projectDir, stdio: 'inherit' })
  console.log('Pushing to Power Apps...')
  execSync(`"${pac}" code push`, { cwd: projectDir, stdio: 'inherit', shell: true })
} else if (command === 'run') {
  execSync('npm run dev', { cwd: projectDir, stdio: 'inherit' })
} else {
  console.log('Usage: npx power-apps [push|run]')
}
