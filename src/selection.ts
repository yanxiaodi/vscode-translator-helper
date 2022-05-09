import { getEnableSelectionHoverTranslationConfiguration } from './config';
import {
  commands,
  ExtensionContext,
  TextEditorSelectionChangeEvent,
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
    clearTimeout(hoverTimer);
    let latencyTime = 300;
    hoverTimer = setTimeout(async () => {
      await showHover(e, translatorService, source, target);
    }, latencyTime);
  });
  context.subscriptions.push(selectionChanged);
};

const showHover = async (
  e: TextEditorSelectionChangeEvent,
  translatorService: ITranslatorService,
  source: string,
  target: string
) => {
  try {
    const selections = e.selections.filter((selection) => !selection.isEmpty);
    if (
      selections.length !== 1 ||
      e.kind !== TextEditorSelectionChangeKind.Mouse
    ) {
      return;
    }
    const text = e.textEditor.document.getText(selections[0]);
    setContent('');
    const result = await translatorService.translate(text, source, target);
    setContent(result);
    commands.executeCommand('editor.action.showHover');
  } catch (error: any) {
    window.showErrorMessage(`Error occurs. ${error}`);
  }
};
