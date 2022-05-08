import * as vscode from 'vscode';
import { ITranslatorService } from './translate-service';
import {
  getParagraph,
  getSelectionText,
  insertText,
  setCurrentEditor,
} from './doc-service';

export const translateInsertCommand = async (
  translatorService: ITranslatorService,
  source: string,
  target: string
) => {
  // The code you place here will be executed every time your command is executed
  setCurrentEditor();
  const text = getParagraph();
  try {
    if (text.trim() !== '') {
      let result = await translatorService.translate(text, source, target);
      insertText(result);
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error occurs. ${error}`);
  }

  // Display a message box to the user
  //vscode.window.showInformationMessage('Hello World!');
};

export const reverseTranslateInsertCommand = async (
  translatorService: ITranslatorService,
  source: string,
  target: string
) => {
  // The code you place here will be executed every time your command is executed
  setCurrentEditor();
  const text = getParagraph();
  try {
    if (text.trim() !== '') {
      let result = await translatorService.translate(text, target, source);
      insertText(result);
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error occurs. ${error}`);
  }
};

export const translateCommand = async (
  translatorService: ITranslatorService,
  source: string,
  target: string,
  statusBarItem: vscode.StatusBarItem
) => {
  // The code you place here will be executed every time your command is executed
  setCurrentEditor();
  const text = getSelectionText();
  try {
    if (text.trim() !== '') {
      const result = await translatorService.translate(text, source, target);
      statusBarItem.hide();
      statusBarItem.text = `$(book) ${result}`;
      statusBarItem.show();
      copyTranslationTextCommand(statusBarItem);
    } else {
      statusBarItem.hide();
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error occurs. ${error}`);
  }

  // Display a message box to the user
  //vscode.window.showInformationMessage('Hello World!');
};

export const copyTranslationTextCommand = (
  statusBarItem: vscode.StatusBarItem
) => {
  try {
    vscode.env.clipboard.writeText(statusBarItem.text.replace('$(book) ', ''));
    vscode.window.showInformationMessage(
      `Translation text copyied to the clipboard!`
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error occurs. ${error}`);
  }
};
