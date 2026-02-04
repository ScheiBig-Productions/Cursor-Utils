import type * as vscode from "vscode"

import { alignCursors } from "./commands/alignCursors"
import { generateNumbers } from "./commands/generateNumbers"
import { padSelections } from "./commands/padSelections"
import { repeatLine } from "./commands/repeatLine"

export const activate = function (context: vscode.ExtensionContext): void {

	context.subscriptions.push(alignCursors)
	context.subscriptions.push(generateNumbers)
	context.subscriptions.push(padSelections)
	context.subscriptions.push(repeatLine)
}

export const deactivate = function (): void { /* empty */ }
