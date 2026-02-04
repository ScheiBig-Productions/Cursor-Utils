import * as vscode from "vscode"

const posIntRegex = /^[1-9][0-9]*$/u

export const repeatLine = vscode.commands.registerCommand(
	"cursor-utils.repeatLine",
	async () => {
		const editor = vscode.window.activeTextEditor
		if (!editor) {
			await vscode.window.showErrorMessage("No active editor found!")
			return
		}

		const originalCursor = editor.selection.active
		const lineText = editor.document.lineAt(originalCursor.line).text

		const userInput = await vscode.window.showInputBox({
			prompt: "Enter number of repetitions",
			validateInput: (i) => posIntRegex.test(i)
				? null
				: "Required a positive number!",
		})

		if (!userInput) {
			return
		}
		const [ linesToAdd ] = (posIntRegex.exec(userInput)) ?? []

		if (editor.selections.length > 1) {
			await vscode.window.showErrorMessage(
				"This command requires that only one cursor is placed!",
			)
			return
		}

		await editor.edit((eb) => {
			/* We find end of current line, to insert final clone to.
			 * Simple duplication of line was bugging when line was last - as there
			 * was no newline at the end, it was duplicated in-place.
			 */
			const lineEnd = editor.document.lineAt(originalCursor.line).range.end
			const textToInsert = Array.from({ length: Number(linesToAdd) })
				.fill(lineText)
				.join("\n")
			eb.insert(lineEnd, `\n${textToInsert}`)
		})

		// eslint-disable-next-line require-atomic-updates -- Not sure what is the problem here
		editor.selections = Array.from({ length: Number(linesToAdd) + 1 }, (_, i) => {
			const cursor = new vscode.Position(originalCursor.line + i, originalCursor.character)
			return new vscode.Selection(cursor, cursor)
		})
	},
)
