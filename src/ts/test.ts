import docsInteraction from './docs/docsInteraction'
import { GLOBALS, VIM } from './main'

const delay = 150
const sleep = (ms = delay) => new Promise((r) => setTimeout(r, ms))

export default async function test() {
  const Q = VIM.CommandQueue
  console.log('Starting tests')
  Q.add({ command: docsInteraction.pasteText, params: { text: 'hello from test!!1\n\n' } })
  Q.add({ command: docsInteraction.pasteText, params: { text: 'hello from test!!2\n\n' } })
  Q.add({ command: docsInteraction.pasteText, params: { text: 'hello from test!!3\n\n' } })
  Q.add({ command: docsInteraction.pasteText, params: { text: 'hello from test!!4\n\n' }, delay: 150 })
  Q.add({ command: docsInteraction.pasteText, params: { text: 'hello from test!!5\n\n' } })
  Q.add({ command: docsInteraction.pasteText, params: { text: 'hello from test!!6\n\n' } })
  Q.add({ command: docsInteraction.pasteText, params: { text: 'hello from test!!7\n\n' } })
  Q.add({ command: docsInteraction.pasteText, params: { text: 'hello from test!!8\n\n' } })
  Q.add({ command: docsInteraction.pasteText, params: { text: 'hello from test!!9\n\n' } })
  Q.add({ command: docsInteraction.pasteText, params: { text: 'hello from test!!10\n\n' } })
  Q.add({ command: docsInteraction.pasteText, params: { text: 'hello from test!!11\n\n' } })
  Q.add({ command: docsInteraction.pasteText, params: { text: 'hello from test!! last 12\n\n' } })
  // VIM.CommandQueue.add({ command: docsInteraction.jumpTo, params: { target: 'h' } })

  // docsInteraction.pasteText('This should paste\n\n')
  // console.log('Pasting')
  // docsInteraction.pasteText('This should paste\n\n')
  // await sleep(delay)
  //
  // console.log('Bold')
  // docsInteraction.toggleBold().pasteText('This text should be bold\n\n')
  // await sleep(delay)
  //
  // console.log('Un-bold')
  // docsInteraction.toggleBold().pasteText('This should not be bold\n\n')
  // await sleep(delay)
  //
  // console.log('Italic')
  // docsInteraction.toggleItalic().pasteText('This text should be Italic\n\n')
  // await sleep(delay)
  //
  // console.log('Un-Italic')
  // docsInteraction.togleItalic().pasteText('This should not be Italic\n\n')
  // await sleep(delay)
  //
  // console.log('Underline')
  // docsInteraction.toggleUnderline().pasteText('This text should be Underline\n\n')
  // await sleep(delay)
  //
  // console.log('Un-Underline')
  // docsInteraction.toggleUnderline().pasteText('This should not be Underline\n\n')
  // await sleep(delay)
  //
  // console.log('Color')
  // docsInteraction.pickColor('red')
  // docsInteraction.pasteText('This text should be red\n\n')
  // await sleep(delay)
  //
  // docsInteraction.pickColor('green')
  // docsInteraction.pasteText('This text should be green\n\n')
  // await sleep(delay)
  //
  // docsInteraction.pickColor('black')
  // docsInteraction.pasteText('Back to black\n\n')
  // await sleep(delay)
  //
  // console.log('Highlight')
  // docsInteraction.pickHighlight('red')
  // docsInteraction.pasteText('This text should be highlighted red\n\n')
  // await sleep(delay)
  //
  // docsInteraction.pickHighlight('green')
  // docsInteraction.pasteText('This text should be highlighted green\n\n')
  // await sleep(delay)
  //
  // docsInteraction.pickHighlight('blue')
  // docsInteraction.pasteText('This text should be highlighted blue\n\n')
  // await sleep(delay)
  //
  // docsInteraction.pickHighlight('none')
  // await sleep(delay)
  // docsInteraction.pasteText('Back to black\n\n')
  // await sleep(delay)
  //
  // docsInteraction.pasteText('1A2A3A4A5A6A7A8A9A10A')
  // await sleep(delay)
  // docsInteraction.pressKey('ArrowLeft', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })
  // await sleep(delay)
  // docsInteraction.jumpTo('A', 7)
  // await sleep(delay)
  // docsInteraction.pasteText('|I was here|')
  // await sleep(delay)
  // docsInteraction.pressKey('ArrowRight', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })
  // await sleep(delay)
  // docsInteraction.pressKey('Enter', {}, 2)
  // await sleep(delay)
  // docsInteraction.pasteText('A10A98A7A6A5A4A3A2A1A OtherBloatText')
  // await sleep(delay)
  // docsInteraction.jumpTo('A', 5, false)
  // await sleep(delay)
  // docsInteraction.pasteText('|I was here|')
  // await sleep(delay)
  // docsInteraction.pressKey('ArrowRight', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })
  // await sleep(delay)
  // docsInteraction.pressKey('Enter', {}, 2)
  // await sleep(delay)
  // docsInteraction.pasteText('aaaaaAaaaaAaa')
  // await sleep(delay)
  // docsInteraction.pressKey('ArrowLeft', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })
  // await sleep(delay)
  // docsInteraction.jumpTo('A')
  // await sleep(delay)
  // docsInteraction.pasteText('|I was here|')
  // await sleep(delay)
}
