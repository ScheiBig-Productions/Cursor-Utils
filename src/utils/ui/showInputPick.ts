import * as vscode from "vscode"

const stripDismiss = function (from: string, dismissChar: string) {
	return from.endsWith(dismissChar) && from.length !== dismissChar.length
		? from.slice(0, -dismissChar.length)
		: from
}

export const showInputPick = async function (options: {
	prompt: string,
	validateInput: (value: string) => string | null,
	history: Array<string>,
	historyQuantity?: number,
	dismissChar?: string,
}): Promise<string | null> {
	options.historyQuantity ??= 15
	const dismissChar = options.dismissChar ?? ""

	const qp = vscode.window.createQuickPick()
	const items = Array.from(options.history)
		.map((c) => ({ label: c }))

	qp.placeholder = options.prompt
	qp.matchOnDescription = false
	qp.matchOnDetail = false
	qp.items = items

	const remember = (value: string) => {
		const i = options.history.indexOf(value)
		if (i !== -1) {
			options.history.splice(i, 1)
		}
		options.history.unshift(value)
		options.history.length = Math.min(
			options.history.length,
			Number(options.historyQuantity),
		)
	}

	qp.onDidChangeValue((e) => {
		if (qp.activeItems.filter((i) => !i.alwaysShow).length === 0
		) {
			const err = options.validateInput(stripDismiss(e, dismissChar))
			global.console.log(stripDismiss(e, dismissChar), items, err)
			if (err && e.length) {
				const errs = err.split("\n")
				qp.items = [
					{ label: `$(error) ${errs[0]}`, alwaysShow: true, detail: errs[1] },
					...items,
				]
			} else {
				qp.items = items
			}
		} else {
			qp.items = items
		}
	})

	return await new Promise<string | null>((res) => {
		qp.onDidAccept(() => {
			const selected = qp.selectedItems.at(0)

			if (selected) {
				if (selected.alwaysShow) { return }
				const { label } = selected
				remember(label)
				qp.hide()
				res(label)
			}

			const typed = stripDismiss(qp.value, dismissChar)
			remember(typed)
			qp.hide()
			res(typed)
		})

		qp.onDidHide(() => void res(null))
		qp.show()
	})
}
