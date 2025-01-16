import * as vscode from "vscode"
import groupBy from "object.groupby"

export function activate(context: vscode.ExtensionContext) {

	let repeatLine = vscode.commands.registerCommand(
		"cursor-utils.repeatLine",
		async () => {
			const editor = vscode.window.activeTextEditor
			if (!editor) {
				vscode.window.showErrorMessage("No active editor found!")
				return
			}

			const pos = editor.selection.active
			const lineText = editor.document.lineAt(pos.line).text

			const userInput = await vscode.window.showInputBox({
				prompt: "Enter number of repetitions and direction",
				validateInput: i => {
					const regex = /^[1-9]\d*$/
					if (!regex.test(i)) {
						return "Required a positive number!"
					}
					return null
				}
			})

			if (!userInput) {
				return
			}
			const [_, rep] = userInput.match(/^([1-9]\d*)$/) || []

			if (editor.selections.length > 1) {
				vscode.window.showErrorMessage("This command requires that only one cursor is placed!")
				return
			}

			await editor.edit(eb => {
				for (let i = 0; i < +rep; i++) {
					const newPos = new vscode.Position(pos.line + 1, 0)
					eb.insert(newPos, lineText + "\n")
				}
			})


			const newSel: vscode.Selection[] = []
			for (let i = 0; i <= +rep; i++) {
				const newCurPos = new vscode.Position(pos.line + i, pos.character)
				newSel.push(new vscode.Selection(newCurPos, newCurPos))
			}

			editor.selections = newSel
		}
	)

	const selOrdered = (sel: readonly vscode.Selection[]) => {
		const selCpy = [...sel]
		selCpy.sort((a, b) =>
			(a.start.line - b.start.line) || (a.start.character - b.start.character)
		)
		return selCpy
	}

	let generateNumbers = vscode.commands.registerCommand(
		"cursor-utils.generateNumbers",
		async () => {
			const editor = vscode.window.activeTextEditor
			if (!editor) {
				vscode.window.showErrorMessage("No active editor found!")
				return
			}

			const userInput = await vscode.window.showInputBox({
				prompt: "Enter range specification",
				validateInput: i => {
					const regex = /^-?\d+[>.][.<]?-?\d+!?$/
					if (!regex.test(i)) {
						return "Required number, followed by two symbols and another number. First symbol is `.` or `>`, second `.` or `<`. `!` might be placed at the end."
					}
					return null
				}
			})

			if (!userInput) {
				return
			}

			const match = userInput.match(/(-?\d+)([>.])([.<])(-?\d+)(!?)/)
			if (!match) {
				vscode.window.showErrorMessage(
					"Invalid range format!")
				return
			}

			const firstNum = +match[1]
			const lastNum = +match[4]
			const firstInc = match[2] !== "."
			const lastInc = match[3] !== "."
			const strict = match[5] === "!"

			if (firstNum < lastNum) {
				const startNumber = firstNum + +firstInc
				const endNumber = lastNum - +lastInc

				var range = function* () {
					for (let i = startNumber; i <= endNumber; i++) {
						yield i
					}
				}
			} else if (firstNum > lastNum) {
				const startNumber = firstNum - +firstInc
				const endNumber = lastNum + +lastInc

				var range = function* () {
					for (let i = startNumber; i >= endNumber; i--) {
						yield i
					}
				}
			} else {
				vscode.window.showErrorMessage(
					"Specified numbers cannot be the same!")
				return
			}

			const reqLen = [...range()].length

			if (reqLen === 0) {
				vscode.window.showErrorMessage(
					"Specified range cannot be the empty!")
				return
			}

			const cursors = editor.selections
			if (strict && cursors.length !== reqLen) {
				vscode.window.showErrorMessage("Strict mode: Number of cursors does not match number of numbers in range!")
				return
			}

			await editor.edit(eb => {
				let rng = range()
				for (let i = 0; i < cursors.length; i++) {
					const sel = selOrdered(cursors)[i]
					const pos = sel.start
					let val = rng.next()
					if (val.value === undefined) {
						rng = range()
						val = rng.next()
					}
					eb.replace(pos, String(val.value))
				}
			})
		}
	)

	let groupSelections = (sel: readonly vscode.Selection[]) => {
		const groups = groupBy(sel, s => s.start.line)
		let maxI = 0
		for (let k in groups) {
			groups[k].sort((a, b) => a.start.character - b.start.character)
			maxI = Math.max(maxI, groups[k].length)
		}
		const res: [number, vscode.Selection[]][] = []
		for (let i = 0; i < maxI; i++) {
			const selCol: vscode.Selection[] = []
			let maxCol = 0
			for (let k in groups) {
				const it = groups[k].at(i)
				if (it) {
					selCol.push(it)
					maxCol = Math.max(maxCol, it.start.character)
				}
			}
			res.push([maxCol, selCol])
		}
		return res
	}

	let alignCursors = vscode.commands.registerCommand(
		"cursor-utils.alignCursors",
		async () => {
			const editor = vscode.window.activeTextEditor
			if (!editor) {
				vscode.window.showErrorMessage("No active editor found!")
				return
			}

			let char = await vscode.window.showInputBox({
				prompt: "Enter character used for padding. Space is default value",
				validateInput: i => i.length <= 1 ? null : "Please enter exactly one character."
			})

			if (char === undefined) {
				return
			}
			char = char === "" ? " " : char

			let groupSel = groupSelections(editor.selections)

			for (let i = 0; i < groupSel.length; i++) {
				const maxCol = groupSel[i][0]
				await editor.edit(eb => {
					for (let sel of groupSel[i][1]) {
						const padLen = maxCol - sel.start.character
						const pad = char.repeat(padLen)
						eb.insert(sel.start, pad)
					}
				})
				groupSel = groupSelections(editor.selections)
			}
		}
	)

	const padCenter = (str: string, len: number, padChar: string, alignStart: boolean) => {
		const padLen = len - str.length
		if (padLen <= 0) {
			return str
		}

		const round = alignStart ? Math.ceil : Math.floor
		const padStart = round(padLen / 2)
		const padEnd = padLen - padStart

		return str.padStart(str.length + padStart, padChar).padEnd(len, padChar)
	}

	function selLen(sel: vscode.Selection) {
		return sel.isSingleLine ? sel.end.character - sel.start.character : -1
	}

	let padSelections = vscode.commands.registerCommand(
		"cursor-utils.padSelections",
		async () => {
			const editor = vscode.window.activeTextEditor
			if (!editor) {
				vscode.window.showErrorMessage("No active editor found!")
				return
			}

			const userInput = await vscode.window.showInputBox({
				prompt: "Enter padding specification",
				validateInput: i => {
					const regex = /^.[<\[\]>](?:[1-9]\d*)?$/
					if (!regex.test(i)) {
						return "Required character, followed by either of `<`, `[`, `]`, `>`. A positive number might be placed at the end"
					}
					return null
				}
			})

			if (!userInput) {
				return
			}

			const match = userInput.match(/^(.)([<\[\]>])([1-9]\d*)?$/)
			if (!match) {
				vscode.window.showErrorMessage(
					"Invalid padding specification!")
				return
			}

			const char = match[1]
			const dir = match[2]
			let len = parseInt(match[3])
			const selections = editor.selections

			if (!len) {
				let maxLen = 0
				for (const sel of selections) {
					if (sel.isSingleLine) {
						maxLen = Math.max(maxLen, selLen(sel))
					}
				}
				if (!maxLen) {
					return
				}
				len = maxLen
			}

			const skip = [-1, len]

			for (let i = 0; i < 1e5; i++) {
				const nextSel = editor.selections
					.filter(s => !skip.includes(selLen(s)))
					.at(0)
				if (!nextSel) {
					break
				}
				let txt = editor.document.getText(editor.selections[i])
				switch (dir) {
					case "<":
						txt = txt.padEnd(len, char)
						break
					case "[":
						txt = padCenter(txt, len, char, false)
						break
					case "]":
						txt = padCenter(txt, len, char, true)
						break
					case ">":
						txt = txt.padStart(len, char)
						break
				}
				await editor.edit(eb => eb.replace(selections[i], txt))
			}
		}
	)

	context.subscriptions.push(repeatLine)
	context.subscriptions.push(generateNumbers)
	context.subscriptions.push(alignCursors)
	context.subscriptions.push(padSelections)
}

export function deactivate() { }
