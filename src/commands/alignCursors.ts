import * as vscode from "vscode"

import { groupBy } from "../utils/groupBy"
import { showInputPick } from "../utils/ui/showInputPick"


const groupSelectionMatrix = (sel: ReadonlyArray<vscode.Selection>) => {
	/* We first group cursors (selection starts) by line - since we support
	 * aligning multiple cursors per line, we need to create matrix of them
	 */
	const lineGroups = groupBy(sel, (s) => s.start.line)
	let maxCursPerLine = 0
	// eslint-disable-next-line guard-for-in -- Groups is null-prototype
	for (const line in lineGroups) {
		/* On each line, we order cursors so they appear in order which they are
		 * visible - so one closest to start is in first column in matrix
		 *
		 * We also search for width of matrix while we're at it.
		 */
		lineGroups[line].sort((a, b) => a.start.character - b.start.character)
		maxCursPerLine = Math.max(maxCursPerLine, lineGroups[line].length)
	}

	/*
	 * We will return result transposed matrix, so that on first row
	 * we have all cursors in given column.
	 *
	 * In this setup, we can process each column sequentially, and next columns
	 * will be recalculated by editor, so we don't need to calculate final positions ourself.
	 *
	 * While we at it, in each matrix row, we place max column position before alignment,
	 * which means we know in final processing where we want to align.
	 */
	const cursorMatrix: Array<[number, Array<vscode.Selection>]> = []
	for (let col = 0; col < maxCursPerLine; col++) {
		const cursInColumn: Array<vscode.Selection> = []
		let maxCol = 0
		// eslint-disable-next-line guard-for-in -- Groups is null-prototype
		for (const line in lineGroups) {
			const cur = lineGroups[line].at(col)
			if (cur) {
				cursInColumn.push(cur)
				maxCol = Math.max(maxCol, cur.start.character)
			}
		}
		cursorMatrix.push([ maxCol, cursInColumn ])
	}
	return cursorMatrix
}

const alignCursorsHistory = new Array<string>()

export const alignCursors = vscode.commands.registerCommand(
	"cursor-utils.alignCursors",
	async () => {
		const editor = vscode.window.activeTextEditor
		if (!editor) {
			await vscode.window.showErrorMessage("No active editor found!")
			return
		}

		let char = await showInputPick({
			prompt: "Enter character used for padding. Space is default value",
			validateInput: (i) => i.length <= 1
				? null
				: "Please enter exactly one character.",
			history: alignCursorsHistory,
			dismissChar: "'",
		})

		if (char === null) {
			return
		}
		char = char === "" ? " " : char

		const groupSelMat = groupSelectionMatrix(editor.selections)

		for (const column of groupSelMat) {
			const [ alignmentTarget, cursors ] = column
			// eslint-disable-next-line no-await-in-loop -- Synchronous editing required
			await editor.edit((eb) => {
				for (const cur of cursors) {
					const padLength = alignmentTarget - cur.start.character
					const padding = char.repeat(padLength)
					eb.insert(cur.start, padding)
				}
			})
		}
	},
)
