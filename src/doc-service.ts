import * as vscode from 'vscode';

let editor: vscode.TextEditor | undefined;

export const setCurrentEditor = () => {
  editor = vscode.window.activeTextEditor;
};

export const getParagraph = (): string => {
  if (editor !== undefined) {
    let startLine = editor.selection.start.line;
    let endLine = editor.selection.end.line;
    const endCharacter = editor.document.lineAt(endLine).text.length;
    editor.selection = new vscode.Selection(
      startLine,
      0,
      startLine,
      endCharacter
    );
    var paragraph = editor.selection;
    let result = editor.document.getText(paragraph);
    if (result !== undefined) {
      return result;
    } else {
      return '';
    }
  } else {
    return '';
  }
};

export const getSelectionText = (): string => {
  if (editor !== undefined) {
    return editor.document.getText(editor.selection);
  } else {
    return '';
  }
};

export const insertText = (text: string): void => {
  if (editor !== undefined) {
    let end = editor.selection.end;
    editor
      .edit((editBuilder) => {
        editBuilder.insert(end, '\n');
        editBuilder.insert(end, text);
      })
      .then((success) => {
        if (success && editor !== undefined) {
          let end = editor.selection.end;
          editor.selection = new vscode.Selection(end, end);
          let startLine = editor.selection.start.line;
          let endLine = editor.selection.end.line;
          const endCharacter = editor.document.lineAt(endLine).text.length;
          editor.selection = new vscode.Selection(
            startLine,
            0,
            startLine,
            endCharacter
          );
        }
      });
  }
};
