import * as  shell from 'shelljs'
import * as assert from 'assert'
import * as escape from 'shell-escape'
import * as ts from 'typescript'

declare var process: {
  env: {
    PATH: string,
    LD_LIBRARY_PATH: string,
    PKG_CONFIG_PATH: string
  },
  cwd: Function
}

const pdfjamOptions = ['nup', 'scale', 'trim', 'suffix', 'outfile', 'papersize', 'paper', 'offset']

function pdfnup(input, _rows, _cols, _options) {
  assert(arguments.length >= 3, 'Insufficient arguments for pdfjam.nup, expected at least 3, was given ' + arguments.length)

  const rows = +_rows
  const cols = +_cols

  assert(Number.isSafeInteger(rows) && rows > 0, 'The number of rows needs to be a number')
  assert(Number.isSafeInteger(cols) && cols > 0, 'The number of columns needs to be a number')

  const options = Object.assign({}, _options, { nup: `${rows}x${cols}` })
  if (!('suffix' in options) && !('outfile' in options)) {
    options.suffix = 'nup'
  }

  return pdfjam(input, options)
}

function pdfjam(_input, _options) {
  const cwd = process.cwd();
  console.log(cwd);
  const BIN = 'node_modules/pdfjam-gcp/bin'
  const LD_LIBRARY_PATH = `${cwd}/${BIN}`


  /* Properly quote inputs */
  let input = _input
  if (!Array.isArray(_input)) {
    input = [_input]
  }

  const options = Object.assign({}, _options)

  let args = []
  if (options.orientation === 'landscape') {
    args.push('--landscape')
  }

  if (options.batch) {
    args.push('--batch')
  }

  /* So they don't get caught in the assert below */
  delete options.orientation
  delete options.batch

  for (const opt of Object.keys(options)) {
    assert(pdfjamOptions.indexOf(opt) !== -1, `Unknown pdfjam option: ${opt}`)

    args = args.concat([`--${opt}`, options[opt]])
  }

  args = args.concat(input)

  // assert(shell.which('pdfjam'), 'No local pdfjam installation detected. Install texlive-extra-utils on your system.')
  const cmd = `${LD_LIBRARY_PATH}/pdfjam ${escape(args)}`;
  console.log('Executing: ', cmd)
  const result = shell.exec(cmd, {
    silent: true
  })

  if (result.code !== 0) {
    throw new Error('Pdfjam failed: exit code ' + result.code)
    // Todo, proper error message
    // throw new Error('Pdfjam failed: ' + result.stderr)
  }
}
const ret = pdfjam.bind(null)
ret.nup = pdfnup

export default pdfjam