import * as vscode from 'vscode'

export const fileIsOpened = (): boolean => {
  return !!vscode.window.activeTextEditor
}

export const fileIsSaved = (): boolean => {
  if (!fileIsOpened) {
    return false
  }

  const document = vscode.window.activeTextEditor.document
  return !document.isUntitled
}

export const getCurrentFilePath = (): string | null => {
  if (!(fileIsOpened && fileIsSaved)) {
    return null
  }

  return vscode.window.activeTextEditor.document.fileName
}
