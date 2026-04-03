import * as vscode from "vscode"

import { groupBy } from "../utils/groupBy"
import { record } from "../utils/record"
import { showInputPick } from "../utils/ui/showInputPick"


export const paddingInsertionsMatrix = (
	sel: ReadonlyArray<vscode.Selection>,
): Array<{ cursor: vscode.Position, padding: number }> => {
	/* We first group cursors (selection starts) by line - since we support
	 * aligning multiple cursors per line, we need to create matrix of them.
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

	/* We will create and calculate cursorPaddingMatrix - the expected paddings and positions
	 * that we should insert them into.
	 *
	 * For that we will collect cursors into columns and then calculate padding
	 * per cursor in given column, keeping track of delta in previous column on given
	 * line. Since cursors are collected in columns when multiple cursors are in same
	 * line, we will never get new cursor in next column, that in previous one was not
	 * in already traversed line.
	 */
	const cursorPaddingMatrix: Array<{ cursor: vscode.Position, padding: number }> = []
	const lineDelta = record<number, number>()

	for (let col = 0; col < maxCursPerLine; col++) {

		/* Grouping cursors into columns for transposed access
		 */
		const cursInColumn: Array<vscode.Selection> = []
		// eslint-disable-next-line guard-for-in -- Groups is null-prototype
		for (const line in lineGroups) {
			const cur = lineGroups[line].at(col)
			if (cur) {
				cursInColumn.push(cur)
			}
		}

		/* Calculating alignmentTarget - character column (position in line) which
		 * cursors in given column should be padded to - maximum position in given line,
		 * with respect to accumulated delta.
		 */
		let alignmentTarget = 0
		for (const cur of cursInColumn) {
			const delta = lineDelta[cur.start.line] ?? 0
			const effectiveStart = cur.start.character + delta
			alignmentTarget = Math.max(alignmentTarget, effectiveStart)
		}

		/* Calculating actual padding to each cursor in current column
		 * and populating resulting matrix. Each calculated padding accumulates into
		 * delta for given line.
		 */
		const paddedColumn = new Array<typeof cursorPaddingMatrix[number]>()
		for (const cur of cursInColumn) {
			const delta = lineDelta[cur.start.line] ?? 0
			const effectiveStart = cur.start.character + delta
			const padLength = alignmentTarget - effectiveStart

			paddedColumn.push({ cursor: cur.start, padding: padLength })
			lineDelta[cur.start.line] = delta + padLength
		}

		cursorPaddingMatrix.push(...paddedColumn)
	}
	return cursorPaddingMatrix
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

		const paddingInsertionMatrix = paddingInsertionsMatrix(editor.selections)

		await editor.edit((eb) => {
			for (const { cursor, padding } of paddingInsertionMatrix) {
				if (padding > 0) {
					eb.insert(cursor, char.repeat(padding))
				}
			}
		})

		/* Move carets to beginnings of selections.
				 */
		editor.selections = editor.selections.map((sel) => {
			const { start, end } = sel
			return new vscode.Selection(end, start)
		})
	},
)
