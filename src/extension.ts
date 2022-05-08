// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {
  translateInsertCommand,
  reverseTranslateInsertCommand,
  translateCommand,
  copyTranslationTextCommand,
} from './commands';

import { TranslationServiceFactory } from './translate-service';
// import * as googleTranslateCN from 'google-translate-cn';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let config = vscode.workspace.getConfiguration('translatorHelper');
  const api = config.api as string;
  const source = config.sourceLanguage as string;
  const target = config.targetLanguage as string;
  const servie = TranslationServiceFactory.createServiceInstance(api);
  const copyTranslationTextCommandId = 'translatorHelper.copyTranslationText';

  let statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  statusBarItem.command = copyTranslationTextCommandId;
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log(
  //   'Congratulations, your extension "translator-helper" is now active!'
  // );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let translateInsert = vscode.commands.registerCommand(
    'translatorHelper.translateInsert',
    async () => await translateInsertCommand(servie, source, target)
  );
  let reverseTranslateInsert = vscode.commands.registerCommand(
    'translatorHelper.reverseTranslateInsert',
    async () => await reverseTranslateInsertCommand(servie, source, target)
  );

  let translate = vscode.commands.registerCommand(
    'translatorHelper.translate',
    async () => await translateCommand(servie, source, target, statusBarItem)
  );

  let copyTranslationText = vscode.commands.registerCommand(
    copyTranslationTextCommandId,
    () => copyTranslationTextCommand(statusBarItem)
  );
  context.subscriptions.push(
    translateInsert,
    reverseTranslateInsert,
    translate,
    copyTranslationText
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
