import { getContent } from './store';
import { CommandIds } from './consts';
import { ITranslatorService } from './translate-service';
import {
  getParagraph,
  getSelectionText,
  insertText,
  setCurrentEditor,
} from './doc-service';
import { commands, env, ExtensionContext, StatusBarItem, window } from 'vscode';

export const regiserCommands = (
  context: ExtensionContext,
  servie: ITranslatorService,
  source: string,
  target: string,
  statusBarItem: StatusBarItem
) => {
  let translateInsert = commands.registerCommand(
    CommandIds.translateInsertCommand,
    async () => await translateInsertCommand(servie, source, target)
  );
  let reverseTranslateInsert = commands.registerCommand(
    CommandIds.reverseTranslateInsertCommand,
    async () => await reverseTranslateInsertCommand(servie, source, target)
  );

  let translate = commands.registerCommand(
    CommandIds.translateCommand,
    async () => await translateCommand(servie, source, target, statusBarItem)
  );

  let copyTranslationText = commands.registerCommand(
    CommandIds.copyTranslationTextCommand,
    copyTranslationTextCommand
  );
  context.subscriptions.push(
    translateInsert,
    reverseTranslateInsert,
    translate,
    copyTranslationText
  );
};

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
    window.showErrorMessage(`Error occurs. ${error}`);
  }
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
    window.showErrorMessage(`Error occurs. ${error}`);
  }
};

export const translateCommand = async (
  translatorService: ITranslatorService,
  source: string,
  target: string,
  statusBarItem: StatusBarItem
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
      // Copy to clipboard
      copyToClipboard(result);
    } else {
      statusBarItem.hide();
    }
  } catch (error: any) {
    window.showErrorMessage(`Error occurs. ${error}`);
  }

  // Display a message box to the user
  //vscode.window.showInformationMessage('Hello World!');
};

export const copyTranslationTextCommand = () => {
  try {
    var content = getContent();
    copyToClipboard(content);
  } catch (error: any) {
    window.showErrorMessage(`Error occurs. ${error}`);
  }
};

const copyToClipboard = (content: string) => {
  env.clipboard.writeText(content);
  window.showInformationMessage(`Translation text copyied to the clipboard!`);
};
