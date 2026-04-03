# Change Log

All notable changes to the "cursor-utils" extension will be documented in this file.

## [1.1.1] - 2026-04-03

Coupled operations in `Cursor Utils: Pad selections` into single edit transaction.

## [1.1.0] - 2026-04-03

Fixed issues with _Align cursors_ (breaking with multi-column cursors) and _Pad selections_ (corrupted input validation rendering command unusable).

Added command `Cursor Utils: Realign selections`, which also works for selection padding, but treats space between selection in same line as stale padding, that can be removed, to re-pad lines in compact way.

## [1.0.0] - 2026-02-04

Major bump due to breaking changes:
- ranges are not full (inclusive both sides) or open on one side (auto-bound) - this changes their syntax,
- commands use custom `QuickPick` widget, modified to allow inputting value not-on-list and simulating error message on validation; this setup requires usage of dismiss character due to limitations.

Internally, project was restructured, to improve readability - especially with symbol names and comments on more convoluted logic.

## [0.1.1] - 2025-01-17

`package.json` fix.

## [0.1.0] - 2025-01-16

Initial release with 4 commands:
- `Cursor Utils: Repeat line`,
- `Cursor Utils: Generate numbers`,
- `Cursor Utils: Align cursors`,
- `Cursor Utils: Pad selections`.
