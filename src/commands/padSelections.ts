import * as vscode from "vscode"

import { showInputPick } from "../utils/ui/showInputPick"

/*
 * Implementation of String.padCenter
 */
const padCenter = (
	thisString: string,
	maxLength: number,
	fillString: string,
	alignStart: boolean,
) => {
	const padLen = maxLength - thisString.length
	if (padLen <= 0) {
		return thisString
	}

	const round = alignStart ? Math.ceil : Math.floor
	const padStart = round(padLen / 2)

	return thisString.padStart(thisString.length + padStart, fillString)
		.padEnd(maxLength, fillString)
}

const selectionLength = function (sel: vscode.Selection) {
	return sel.isSingleLine ? sel.end.character - sel.start.character : -1
}

const paddingConfigRegex = /^(.)([<[\]>])([1-9][0-9]*)?$/u

const regexErrorMessage = `
Invalid padding specification!
Allowed format: char+%dir+num, dir := <, [,  ], >, num is optional.
`.trim()

const padSelectionsHistory = new Array<string>()

export const padSelections = vscode.commands.registerCommand(
	"cursor-utils.padSelections",
	async () => {
		const editor = vscode.window.activeTextEditor
		if (!editor) {
			await vscode.window.showErrorMessage("No active editor found!")
			return
		}

		const userInput = await showInputPick({
			prompt: "Enter padding specification",
			validateInput: (i) => paddingConfigRegex.test(i)
				? null
				: regexErrorMessage,
			history: padSelectionsHistory,
			dismissChar: "'",
		})

		if (!userInput) {
			return
		}

		const match = paddingConfigRegex.exec(userInput)
		if (!match) {
			await vscode.window.showErrorMessage(regexErrorMessage)
			return
		}

		const [ _match, padChar, padDirection, maybePadLength ] = match
		let padLength = parseInt(maybePadLength, 10) || null
		const { selections } = editor

		if (padLength === null) {
			let maxSelectionLength = 0
			for (const sel of selections) {
				if (sel.isSingleLine) {
					maxSelectionLength = Math.max(maxSelectionLength, selectionLength(sel))
				}
			}
			if (!maxSelectionLength) {
				return
			}
			padLength = maxSelectionLength
		}

		/* We skip full-length selections (already aligned)
		 * and invalid ones (multiline, not sure how to align).
		 */
		const skip = [ -1, padLength ]

		for (let i = 0; i < editor.selections.length; i++) {
			const nextSelectionToPad = editor.selections
				.find((s) => !skip.includes(selectionLength(s)))
			if (!nextSelectionToPad) {
				break
			}
			let textToPad = editor.document.getText(editor.selections[i])
			switch (padDirection) {
				case "<" :
					textToPad = textToPad.padEnd(padLength, padChar)
					break
				case "[" :
					textToPad = padCenter(textToPad, padLength, padChar, false)
					break
				case "]" :
					textToPad = padCenter(textToPad, padLength, padChar, true)
					break
				case ">" :
					textToPad = textToPad.padStart(padLength, padChar)
					break
				default :
					throw TypeError(`Unknown direction ${padDirection}`)
			}
			// eslint-disable-next-line no-await-in-loop -- Synchronous editing required
			await editor.edit((eb) => eb.replace(selections[i], textToPad))
		}
	},
)
