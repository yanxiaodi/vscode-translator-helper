import { getEnableSelectionHoverTranslationConfiguration } from './config';
import {
  commands,
  ExtensionContext,
  TextEditorSelectionChangeKind,
  window,
} from 'vscode';
import { setCurrentEditor } from './doc-service';
import { setContent } from './store';
import { ITranslatorService } from './translate-service';

export const registerSelectionBehavior = (
  context: ExtensionContext,
  translatorService: ITranslatorService,
  source: string,
  target: string
) => {
  if (!getEnableSelectionHoverTranslationConfiguration()) {
    return;
  }
  setCurrentEditor();
  let hoverTimer: NodeJS.Timeout;
  const selectionChanged = window.onDidChangeTextEditorSelection(async (e) => {
    const selections = e.selections.filter((selection) => !selection.isEmpty);
    if (
      selections.length !== 1 ||
      e.kind !== TextEditorSelectionChangeKind.Mouse
    ) {
      return;
    }

    let latencyTime = 300;
    clearTimeout(hoverTimer);
    setContent('');
    const text = e.textEditor.document.getText(selections[0]);
    const result = await translatorService.translate(text, source, target);
    setContent(result);
    hoverTimer = setTimeout(async () => {
      commands.executeCommand('editor.action.showHover');
    }, latencyTime);
  });
  context.subscriptions.push(selectionChanged);
};
