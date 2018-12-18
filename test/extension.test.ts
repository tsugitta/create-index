import * as assert from 'assert'
import * as fs from 'fs'
import * as mkdirp from 'mkdirp'
import * as path from 'path'
import * as rimraf from 'rimraf'
import * as vscode from 'vscode'
import * as extension from '../src/extension'

const testResourcesPath = path.join(__dirname, 'test-resources')

suite('Extension Tests', () => {
  setup(() => {
    mkdirp.sync(testResourcesPath)
    fs.writeFileSync(path.join('foo.ts'), 'some data')
  })

  suite('addCurrentFileExportationToIndex', () => {
    suite('when file is not opened', () => {
      test('fails with error', () => {})
    })

    test('Something 1', () => {
      assert.equal(-1, [1, 2, 3].indexOf(5))
      assert.equal(-1, [1, 2, 3].indexOf(0))
    })
  })
})
