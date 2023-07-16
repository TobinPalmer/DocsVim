# DocsVim - Vim on Google Docs

## What?

DocsVim is a (fairly good if I say myself) vim emulation layer on top that maps Vim Keys to their corresponding inputs
on Google Docs.

## Why?

If you're like me and basically forced to use Google Docs to school assignments, you may find random `:w`s or `ciw`s in
your work.
After trying many alternatives that just don't work great such as pasting from a vim register to the doc, I
just decided to make this

## How

As mentioned before, this plugin works by converting vim keystrokes to regular keys, ex: `j` -> `ArrowDown`. This is a
fairly basic explanation, and this supports many more features like commands with `:` and motions like `ciw`.

This plugin was inspired by my [original attempt](https://github.com/TobinPalmer/OldDocsVim) at making this (doesn't
work on Mac) which was inspired by the [OG DocsVim](https://github.com/matthewsot/docs-vim)

## Features

- Many vim commands
- Many vim motions
- Basic Marco Support (beta)
- Basic Command Support (beta)
- Normal, Visual, Visual Line, and Insert Mode supported
- Tested on Mac. Potentially works on Windows and Linux

## Installing

- Building
    1. Run `npm run i && npm run build`.
    2. Visit `chrome://extensions`
    3. Make sure developer mode is on
    4. Click `Load Unpacked` and select the dist folder.
    5. DocsVim **should** work
- Install on Chrome Webstore
    - Not yet :(
