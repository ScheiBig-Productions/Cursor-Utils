# ![logo icon small](https://github.com/ScheiBig-Production/Cursor-Utils/blob/main/img/icon/icon_sm.png?raw=true) Cursor Utils
Utilities extending experience of working with multiple cursors.

### Reasoning

VSCode build-in multi-cursors are quite powerful themselves, however grass is always greener on the other side.
This extension attempts to provide some of great ways of programmatically modifying text around multiple cursors.

### Feature set

This extension provides few commands:

- `Cursor Utils: Repeat line` - provides way to copy current line exactly specified amount of times.
  Each newly created line attaches new cursor in same column as origin line.
- `Cursor Utils: Generate numbers` - provides ability to paste number sequences under cursor positions.
- `Cursor Utils: Align cursors` - aligns cursors to right-most one, using provided padding character.
- `Cursor Utils: Pad selections` - pads selections to provided length or to length of longest selection, using provided padding characters.

## Details

### Repeat line

This command accepts number of repetitions as input.

It assumes, that only one cursor is placed in the editor.

*Example:*
- `> Cursor Utils: Repeat line` 
- `4`

![repeat line showcase](https://github.com/ScheiBig-Production/Cursor-Utils/blob/main/img/examples/repeat_line.png)

### Generate numbers

This command accepts range specification as input.

Range specification consists of:
- a first number,
- `>` for exclusive bound or `.` for inclusive bound of first number,
- `<` for exclusive bound or `.` for inclusive bound of second number,
- a second number,
- optional `!`.

Range direction is determined by comparison of two numbers - if first is smaller, then range is growing towards second number.
If first number is smaller, the range is shrinking towards second number.

Passing `!` after range ensures strict mode - in strict mode, amount on numbers in range must be the same as number of cursors.
Otherwise in lenient mode, if number of cursors is smaller, then not all numbers from range will be used (remaining will be skipped).
If number of cursors is greater, each time range will run out of numbers, it will simply start counting from beginning again.

It is important that cursors will be processed in order of characters in file (top-bottom, left-right) and not order that they were placed.

Selections are treated as they were cursors placed on beginning of those selections.

*Example:*
- `> Cursor Utils: Generate numbers` 
- `0.<5!`

![generate numbers showcase](https://github.com/ScheiBig-Production/Cursor-Utils/blob/main/img/examples/generate_numbers.png)

### Align cursors

This command accepts single character as input.

It aligns all cursors in line, putting padding character before cursors as necessary.
If multiple cursors are placed in each line, they are processed in groups ("columns") from left to right.
If only one selection in given column is available, it will not be modified.

Selections are treated as they were cursors placed on beginning of those selections.

*Example:*
- `> Cursor Utils: Align cursors`
- ` `

![align cursors showcase](https://github.com/ScheiBig-Production/Cursor-Utils/blob/main/img/examples/align_cursors.png)

### Pad selections

This command accepts padding specification as input.

Padding specification consists of:
- a single padding character,
- one of padding direction specifiers:
  - `<` - aligns selection to left, adding padding to end,
  - `[` - aligns selection to center, with overflow on end,
  - `]` - aligns selection to center, with overflow on  start,
  - `>` - aligns selection to right, adding padding to start,
- optional number - target length.

If target length is omitted, then it is defaulted to length to longest selection.
Center alignment might produce overflow - if required padding is odd number.

This command only processes selections that do not span multiple lines.

*Examples:*

Padding without length:
- `> Cursor Utils: Pad selections`
- `.>`

![align cursors showcase](https://github.com/ScheiBig-Production/Cursor-Utils/blob/main/img/examples/pad_selections-1.png)

Padding with length:
- `> Cursor Utils: Pad selections`
- `_[8`

![align cursors showcase](https://github.com/ScheiBig-Production/Cursor-Utils/blob/main/img/examples/pad_selections-2.png)

## Planned features:

- `Repeat line`-like utility, that would allow repeating section of multiple lines covered by selection,
- `Repeat line`-like utility, that would allow repeating selection - probably inserting results at end of lines (requires directionality),
- `Generate numbers` - accepting other types of sequences - mainly ascii letter sequences in alphabetical order and hexadecimal numbers,
- `Align cursors`-like utility for aligning selections (would require directionality).
