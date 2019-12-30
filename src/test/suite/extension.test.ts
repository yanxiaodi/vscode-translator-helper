import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../../extension';
import * as path from 'path';

const testFileLocation = '/../../../src/test/suite/test.md';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test("Should get the correct translation on the status bar", async () => {
		const uri = vscode.Uri.file(
			path.join(__dirname + testFileLocation)
		);
		const document = await vscode.workspace.openTextDocument(uri);
		const editor = await vscode.window.showTextDocument(document);
		// Make sure the file is fully loaded before interacting with it.
		await sleep(200);
		let startLine = editor.selection.start.line;
		let endLine = editor.selection.end.line;
		const endCharacter = editor.document.lineAt(endLine).text.length;
		editor.selection = new vscode.Selection(startLine, 0, startLine, endCharacter);
		vscode.commands.executeCommand('extension.translate').then(result => {
			let statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
			assert.equal(statusBarItem.text.indexOf('你好') > -1, true);
			vscode.commands.executeCommand('translatorHelper.copyTranslationText').then(() => {
				vscode.env.clipboard.readText().then(text => {
					assert.equal(text.indexOf('你好') > -1, true);
				});
			});
		});
	});

	test("Should get the correct translation then insert it.", async () => {
		const uri = vscode.Uri.file(
			path.join(__dirname + testFileLocation)
		);
		const document = await vscode.workspace.openTextDocument(uri);
		const editor = await vscode.window.showTextDocument(document);
		// Make sure the file is fully loaded before interacting with it.
		await sleep(200);
		vscode.commands.executeCommand('extension.translateInsert').then(result => {
			assert.equal(editor.document.getText(editor.selection).indexOf('你好') > -1, true);
		});
	});

	function sleep(ms: number): Promise<void> {
		return new Promise(resolve => {
			setTimeout(resolve, ms);
		});
	}
});
