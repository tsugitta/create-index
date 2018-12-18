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
import { getExtension } from '../utils/file-name'

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
  const extension = getExtension(filePath).replace('x', '') // jsx -> js
  return path.join(dirPath, `index.${extension}`)
}

const getExportationLine = (filePath: string): string => {
  const fileName = path.basename(filePath)
  const extension = getExtension(fileName)
  const fileNameWithoutExtension = fileName.replace(`.${extension}`, '')
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

    if (!filePath.match(/\.[jt]sx?$/)) {
      throw new ApplicationError('The file is not JavaScipt or TypeScript.')
    }

    const indexFilePath = getIndexPath(filePath)

    if (filePath === indexFilePath) {
      throw new ApplicationError('The file is the index file itself.')
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
