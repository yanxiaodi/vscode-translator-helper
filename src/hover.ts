import { isHoverOnSelection } from './doc-service';
import {
  ExtensionContext,
  Hover,
  languages,
  MarkdownString,
  Uri,
} from 'vscode';
import { getContent } from './store';
import { CommandIds } from './consts';

export const registerHover = (context: ExtensionContext) => {
  const hover = languages.registerHoverProvider(
    { scheme: 'file' },
    {
      provideHover(document, position) {
        if (isHoverOnSelection(position)) {
          const result = getContent();
          if (result.length > 0) {
            const copyCommandUri = Uri.parse(
              `command:${CommandIds.copyTranslationTextCommand}`
            );
            const copyCommand = `[Copy](${copyCommandUri} "Copy to clipboard")`;
            const commands = new MarkdownString(copyCommand);
            // To enable command URIs in Markdown content, you must set the `isTrusted` flag.
            // When creating trusted Markdown string, make sure to properly sanitize all the
            // input content so that only expected command URIs can be executed
            commands.isTrusted = true;
            const content = new MarkdownString(result);
            const header = new MarkdownString(
              '[Translator Helper](https://github.com/yanxiaodi/vscode-translator-helper)'
            );
            return new Hover([header, content, commands]);
          }
          return null;
        }
        return null;
      },
    }
  );
  context.subscriptions.push(hover);
};
