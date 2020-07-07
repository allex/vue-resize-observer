// vim: set ft=javascript fdm=marker et ff=unix tw=80 sw=2:
// author: allex_wang <http://iallex.com>

import path from 'path'

import { version, name, author, license, description, dependencies, peerDependencies } from './package.json'

const banner = (name, short = false) => {
  let s
  if (short) {
    s = `/*! ${name} v${version} | ${license} licensed | ${author.name || author} */`
  } else {
    s = `/**
 * ${name} v${version} - ${description}
 *
 * @author ${author}
 * Released under the ${license} license.
 */`
  }
  return s
}

const resolve = p => path.resolve(__dirname, '.', p)

const plugins = [
  'node-builtins',
  'resolve',
  'typescript',
  'babel',
  'commonjs',
  'globals'
]

export default {
  destDir: resolve('lib'),
  vue: true,
  dependencies: { events: true, ...dependencies, ...peerDependencies },
  compress: false,
  entry: [
    {
      input: resolve('src/index.tsx'),
      plugins,
      output: [
        { format: 'es', file: 'index.esm.js', banner: banner(name, true) }
      ]
    }
  ]
}
