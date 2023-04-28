import docsInteraction from './docs/docsInteraction'
import { GLOBALS } from './main'

const delay = 100
const sleep = (ms = delay) => new Promise((r) => setTimeout(r, ms))

export default async function test() {
  console.log('Starting tests')
  console.log('Pasting')
  docsInteraction.pasteText('This should paste\n\n')
  await sleep(delay)

  console.log('Bold')
  docsInteraction.toggleBold().pasteText('This text should be bold\n\n')
  await sleep(delay)

  console.log('Un-bold')
  docsInteraction.toggleBold().pasteText('This should not be bold\n\n')
  await sleep(delay)

  console.log('Italic')
  docsInteraction.toggleItalic().pasteText('This text should be Italic\n\n')
  await sleep(delay)

  console.log('Un-Italic')
  docsInteraction.toggleItalic().pasteText('This should not be Italic\n\n')
  await sleep(delay)

  console.log('Underline')
  docsInteraction.toggleUnderline().pasteText('This text should be Underline\n\n')
  await sleep(delay)

  console.log('Un-Underline')
  docsInteraction.toggleUnderline().pasteText('This should not be Underline\n\n')
  await sleep(delay)

  console.log('Color')
  docsInteraction.pickColor('red')
  docsInteraction.pasteText('This text should be red\n\n')
  await sleep(delay)

  docsInteraction.pickColor('green')
  docsInteraction.pasteText('This text should be green\n\n')
  await sleep(delay)

  docsInteraction.pickColor('black')
  docsInteraction.pasteText('Back to black\n\n')
  await sleep(delay)

  console.log('Highlight')
  docsInteraction.pickHighlight('red')
  docsInteraction.pasteText('This text should be highlighted red\n\n')
  await sleep(delay)

  docsInteraction.pickHighlight('green')
  docsInteraction.pasteText('This text should be highlighted green\n\n')
  await sleep(delay)

  docsInteraction.pickHighlight('blue')
  docsInteraction.pasteText('This text should be highlighted blue\n\n')
  await sleep(delay)

  docsInteraction.pickHighlight('none')
  await sleep(delay)
  docsInteraction.pasteText('Back to black\n\n')
  await sleep(delay)

  docsInteraction.pasteText('Jump B to A ok ok gg')
  await sleep(delay)
  docsInteraction.pressKey('ArrowLeft', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })
  await sleep(delay)
  docsInteraction.jumpTo('A')
  await sleep(delay)
  //   docsInteraction.pressKey('ArrowRight', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })
  //   await sleep(delay)
  //   docsInteraction.pressKey('Enter', {}, 2)
  //   await sleep(delay)
  //   docsInteraction.pasteText('aaaaaAaaaaAaa')
  //   await sleep(delay)
  //   docsInteraction.pressKey('ArrowLeft', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })
  //   await sleep(delay)
  //   docsInteraction.jumpTo('A')
}
