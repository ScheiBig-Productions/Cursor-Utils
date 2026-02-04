# Change Log

All notable changes to the "cursor-utils" extension will be documented in this file.

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
