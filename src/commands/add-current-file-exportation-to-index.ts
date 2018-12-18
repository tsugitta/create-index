import * as path from 'path'
import * as vscode from 'vscode'
import {
  fileIsOpened,
  fileIsSaved,
  getCurrentFilePath,
} from '../utils/editor-helper'
import { ApplicationError } from '../utils/errors'
import {
  createFileIfNotExists,
  getLines,
  writeFile,
} from '../utils/file-manager'

const INDEX_FILE_NAME = 'index.ts'

const getFilePath = (): string => {
  if (!fileIsOpened()) {
    throw new ApplicationError('No file is opened.')
  }

  if (!fileIsSaved()) {
    throw new ApplicationError('The file is not saved yet.')
  }

  return getCurrentFilePath()
}

const getIndexPath = (filePath: string): string => {
  const dirPath = path.dirname(filePath)
  return path.join(dirPath, INDEX_FILE_NAME)
}

const getExportationLine = (filePath: string): string => {
  const fileName = path.basename(filePath)
  const fileNameWithoutExtension = fileName.match(/(.+)\..+/)[1]
  return `export * from './${fileNameWithoutExtension}';`
}

const writeLineAndSort = (filePath: string, line: string): void => {
  const lines = getLines(filePath).filter(l => l !== '')

  if (!lines.includes(line)) {
    lines.push(line)
  }

  lines.sort()
  const written = `${lines.join('\n')}\n`

  writeFile(filePath, written)
}

export const addCurrentFileExportationToIndex = () => {
  try {
    const filePath = getFilePath()
    const indexFilePath = getIndexPath(filePath)

    if (filePath === indexFilePath) {
      throw new ApplicationError('The file is index.ts itself.')
    }

    if (!filePath.match(/\.tsx?$/)) {
      throw new ApplicationError('The file is not TypeScript.')
    }

    createFileIfNotExists(indexFilePath)

    const exportationLine = getExportationLine(filePath)
    writeLineAndSort(indexFilePath, exportationLine)
  } catch (err) {
    if (err instanceof ApplicationError) {
      vscode.window.showErrorMessage(err.message)
      return
    }

    throw err
  }
}
