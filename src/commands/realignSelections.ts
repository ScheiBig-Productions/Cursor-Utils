import * as vscode from "vscode"

import { groupBy } from "../utils/groupBy"
import { showInputPick } from "../utils/ui/showInputPick"

import { paddingInsertionsMatrix } from "./alignCursors"


const paddingShrinkageMatrix = (sel: ReadonlyArray<vscode.Selection>) => {
	/* We first group selections by line - since we support
	 * aligning multiple cursors per line, we need to create matrix of them.
	 */
	const lineGroups = groupBy(sel, (s) => s.start.line)

	/* We will create and calculate paddingShrinkMatrix - the expected Ranges that should
	 * be cleared, to collapse selections next to each other.
	 */
	const paddingShrinkMatrix: Array<vscode.Range> = []
	// eslint-disable-next-line guard-for-in -- Groups is null-prototype
	for (const line in lineGroups) {
		/* On each line, we order selections so they appear in order which they are
		 * visible - so one closest to start is in first column in matrix
		 */
		const lineGroup = lineGroups[line]
		lineGroup.sort((a, b) => a.start.character - b.start.character)

		/* For each pair of neighboring selections, we create range for text between
		 * them - we will treat this as stale range, which can be safely removed.
		 */
		for (let i = 1; i < lineGroup.length; i++) {
			const prev = lineGroup[i - 1]
			const curr = lineGroup[i]

			if (curr.start.isAfter(prev.end)) {
				paddingShrinkMatrix.push(new vscode.Range(prev.end, curr.start))
			}
		}
	}


	return paddingShrinkMatrix
}

const alignCursorsHistory = new Array<string>()

export const realignSelections = vscode.commands.registerCommand(
	"cursor-utils.realignSelections",
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

		const paddingShrinkMatrix = paddingShrinkageMatrix(editor.selections)

		await editor.edit((eb) => {
			for (const range of paddingShrinkMatrix) {
				eb.delete(range)
			}
		})

		const paddingInsertionMatrix = paddingInsertionsMatrix(editor.selections)

		await editor.edit((eb) => {
			for (const { cursor, padding } of paddingInsertionMatrix) {
				eb.insert(cursor, char.repeat(padding + 1))
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
