/* eslint-disable no-unmodified-loop-condition --
 * Oversimplification of loop boundary
 */
import * as vscode from "vscode"

import { showInputPick } from "../utils/ui/showInputPick"
import { zip } from "../utils/zip"

type RangeDirectionSpecifier = "<<" | ">>"

const orderedSelections = (
	sel: ReadonlyArray<vscode.Selection>,
	dir: "asc"|"desc",
) => {
	const factor = dir === "asc" ? 1 : -1
	return [ ...sel ].sort(
		(a, b) => ((a.start.line - b.start.line) * factor)
			|| ((a.start.character - b.start.character) * factor),
	)

}

const generateNumbersHistory = new Array<string>()

// eslint-disable-next-line @stylistic/max-len -- Cannot break Regex
const numberRangeRegex = /^(?:(-?(?:[0-9]|[1-9][0-9]+))\.\.(-?(?:[0-9]|[1-9][0-9]+))(!?)|(-?(?:[0-9]|[1-9][0-9]+))(<<|>>)|(<<|>>)(-?(?:[0-9]|[1-9][0-9]+)))$/u

const regexErrorMessage = `
Invalid range format.
Allowed formats: num..num, num..num!, num<<, num>>, <<num, >>num
`.trim()

const generateNumbersFullRange = async function (
	editor: vscode.TextEditor,
	firstNumber: number,
	secondNumber: number,
	strict: boolean,
) {
	if (firstNumber === secondNumber) {
		var range = function* (repeat?: boolean) {
			do {
				yield firstNumber
			} while (repeat)
		}
		var cursors = orderedSelections(editor.selections, "asc")
	} else {
		var range = function* (repeat?: boolean) {
			do {
				for (let i = firstNumber; i <= secondNumber; i++) {
					yield i
				}
			} while (repeat)
		}
		if (firstNumber < secondNumber) {
			var cursors = orderedSelections(editor.selections, "asc")
		} else {
			var cursors = orderedSelections(editor.selections, "desc")
		}
	}

	const rangeLength = [ ...range(false) ].length

	if (strict && cursors.length !== rangeLength) {
		await vscode.window.showErrorMessage(
			"Strict mode: Number of cursors does not match number of numbers in range!",
		)
		return
	}

	await editor.edit((eb) => {
		for (const [ cur, num ] of zip(cursors, range(true))) {
			eb.replace(cur.start, String(num))
		}
	})
}

const generateNumbersOpenFrom = async function (
	editor: vscode.TextEditor,
	boundary: number,
	specifier: RangeDirectionSpecifier,
) {
	switch (specifier) {
		case "<<" :
			var range = function* () {
				for (let i = boundary; ; i++) {
					yield i
				}
			}
			break
		case ">>" :
			var range = function* () {
				for (let i = boundary; ; i--) {
					yield i
				}
			}
			break
		default :
			throw TypeError(`Unknown specifier ${String(specifier)}`)
	}
	var cursors = orderedSelections(editor.selections, "asc")


	await editor.edit((eb) => {
		for (const [ cur, num ] of zip(cursors, range())) {
			eb.replace(cur.start, String(num))
		}
	})
}

const generateNumbersOpenInto = async function (
	editor: vscode.TextEditor,
	boundary: number,
	specifier: RangeDirectionSpecifier,
) {
	switch (specifier) {
		case "<<" :
			var range = function* () {
				for (let i = boundary; ; i--) {
					yield i
				}
			}
			break
		case ">>" :
			var range = function* () {
				for (let i = boundary; ; i++) {
					yield i
				}
			}
			break
		default :
			throw TypeError(`Unknown specifier ${String(specifier)}`)
	}
	var cursors = orderedSelections(editor.selections, "desc")


	await editor.edit((eb) => {
		for (const [ cur, num ] of zip(cursors, range())) {
			eb.replace(cur.start, String(num))
		}
	})
}

export const generateNumbers = vscode.commands.registerCommand(
	"cursor-utils.generateNumbers",
	async () => {
		const editor = vscode.window.activeTextEditor
		if (!editor) {
			await vscode.window.showErrorMessage("No active editor found!")
			return
		}

		const userInput = await showInputPick({
			prompt: "Enter range specification (put space at the end to dismiss history)",
			validateInput: (i) => numberRangeRegex.test(i)
				? null
				: regexErrorMessage,
			history: generateNumbersHistory,
			dismissChar: "'",
		})

		if (!userInput) {
			return
		}

		const match = numberRangeRegex.exec(userInput)
		if (!match) {
			await vscode.window.showErrorMessage(regexErrorMessage)
			return
		}

		const [
			_match,
			fullFN,
			fullSN,
			fullEM,
			fromN,
			fromS,
			intoS,
			intoN,
		] = match

		if (fullFN) {
			await generateNumbersFullRange(
				editor,
				Number(fullFN),
				Number(fullSN),
				fullEM === "!",
			)
			return
		}

		if (fromN) {
			await generateNumbersOpenFrom(
				editor,
				Number(fromN),
				fromS as RangeDirectionSpecifier,
			)
			return
		}

		if (intoN) {
			await generateNumbersOpenInto(
				editor,
				Number(intoN),
				intoS as RangeDirectionSpecifier,
			)
		}

	},
)
