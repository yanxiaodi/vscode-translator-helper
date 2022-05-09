import { isHoverOnSelection } from './doc-service';
import { ExtensionContext, Hover, languages, MarkdownString } from 'vscode';
import { getContent } from './store';

export const registerHover = (context: ExtensionContext) => {
  const hover = languages.registerHoverProvider(
    { scheme: 'file' },
    {
      provideHover(document, position) {
        if (isHoverOnSelection(position)) {
          const result = getContent();
          if (result.length > 0) {
            const content = new MarkdownString(result);
            return new Hover(content);
          }
          return null;
        }
        return null;
      },
    }
  );
  context.subscriptions.push(hover);
};
