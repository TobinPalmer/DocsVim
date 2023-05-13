import docsInteraction from './docs/docsInteraction'
import { VIM } from './main'
export default async function test() {
  console.log('starting tests')
  const Q = VIM.CommandQueue

  Q.add({ func: docsInteraction.pasteText, params: { text: "This text shouldn't be bold\n\n" }, delay: 5 })
  Q.add({ func: docsInteraction.toggleBold, params: [], delay: 5 })
  Q.add({ func: docsInteraction.pasteText, params: { text: 'This text should be bold\n\n' }, delay: 5 })
  Q.add({ func: docsInteraction.toggleBold, params: [] })
  Q.add({ func: docsInteraction.pasteText, params: { text: "This text shouldn't be bold\n\n" } })

  Q.add({ func: docsInteraction.toggleItalic, params: [] })
  Q.add({ func: docsInteraction.pasteText, params: { text: 'This text should be italic\n\n' } })
  Q.add({ func: docsInteraction.toggleItalic, params: [] })
  Q.add({ func: docsInteraction.pasteText, params: { text: "This text shouldn't be italic\n\n" } })

  Q.add({ func: docsInteraction.toggleUnderline, params: [] })
  Q.add({ func: docsInteraction.pasteText, params: { text: 'This text should be underlined\n\n' } })
  Q.add({ func: docsInteraction.toggleUnderline, params: [] })
  Q.add({ func: docsInteraction.pasteText, params: { text: "This text shouldn't be underlined\n\n" } })

  Q.add({ func: docsInteraction.pickColor, params: { color: 'red' } })
  Q.add({ func: docsInteraction.pasteText, params: { text: 'This text should be red\n\n' } })
  Q.add({ func: docsInteraction.pickColor, params: { color: 'green' } })
  Q.add({ func: docsInteraction.pasteText, params: { text: 'This text should be green\n\n' } })
  Q.add({ func: docsInteraction.pickColor, params: { color: 'purple' } })
  Q.add({ func: docsInteraction.pasteText, params: { text: 'This text should be purple\n\n' } })
  Q.add({ func: docsInteraction.pickColor, params: { color: 'black' } })
  Q.add({ func: docsInteraction.pasteText, params: { text: 'Back to black\n\n' } })

  Q.add({ func: docsInteraction.pasteText, params: { text: 'aAaAaAaa->A<-aaAaa' } })
  Q.add({ func: docsInteraction.jumpTo, params: { target: 'A', forward: false, repeat: 2 }, delay: 200 })
  Q.add({ func: docsInteraction.pasteText, params: { text: '|I was here|' } })

  Q.add({ func: docsInteraction.pressKey, params: { key: 'ArrowRight', opts: { ctrlKey: true } } })
  Q.add({ func: docsInteraction.pasteText, params: { text: '\n\n' } })

  Q.add({ func: docsInteraction.pasteText, params: { text: 'aAaAaAaa->A<-aaAaa' } })
  Q.add({ func: docsInteraction.pressKey, params: { key: 'ArrowLeft', opts: { ctrlKey: true } } })
  Q.add({ func: docsInteraction.jumpTo, params: { target: 'A', forward: true, repeat: 2 }, delay: 200 })

  Q.add({ func: docsInteraction.pasteText, params: { text: '|I was here|' } })
  Q.add({ func: docsInteraction.pressKey, params: { key: 'ArrowRight', opts: { ctrlKey: true } } })
  Q.add({ func: docsInteraction.pasteText, params: { text: '\n\n' } })

  Q.add({ func: docsInteraction.pasteText, params: { text: 'aAaAaAaa->A<-aaAaa' } })
  Q.add({ func: docsInteraction.pressKey, params: { key: 'ArrowRight', opts: { ctrlKey: true } } })
  Q.add({ func: docsInteraction.jumpTo, params: { target: 'A', forward: false, repeat: 2 }, delay: 200 })
  Q.add({ func: docsInteraction.pasteText, params: { text: '|I was here|' } })

  // Q.add({ func: docsInteraction.pasteText, params: { text: 'no delay 1\n\n' } })
  // Q.add({ func: docsInteraction.pasteText, params: { text: 'no delay 2\n\n' } })
  // Q.add({ func: docsInteraction.pasteText, params: { text: 'no delay 3\n\n' } })

  // Q.add({ func: docsInteraction.pickColor('green'), params: { _: 'green' } })
  // Q.add({ func: docsInteraction.pasteText('This text should be green\n\n'), params: { _: 'This text should be green\n\n' } })
  // Q.add({ func: docsInteraction.pickColor('black'), params: { _: 'black' } })
  // Q.add({ func: docsInteraction.pasteText('Back to black\n\n'), params: { _: 'Back to black\n\n' } })
  // Q.add({ func: docsInteraction.pickHighlight('red'), params: { _: 'red' } })
  // Q.add({ func: docsInteraction.pasteText('This text should be highlighted red\n\n'), params: { _: 'This text should be highlighted red\n\n' } })
  // Q.add({ func: docsInteraction.pickHighlight('green'), params: { _: 'green' } })
  // Q.add({ func: docsInteraction.pasteText('This text should be highlighted green\n\n'), params: { _: 'This text should be highlighted green\n\n' } })
  // Q.add({ func: docsInteraction.pickHighlight('blue'), params: { _: 'blue' } })
  // Q.add({ func: docsInteraction.pasteText('This text should be highlighted blue\n\n'), params: { _: 'This text should be highlighted blue\n\n' } })
  // Q.add({ func: docsInteraction.pickHighlight('none'), params: { _: 'none' } })
  // Q.add({ func: docsInteraction.pasteText('Back to black\n\n'), params: { _: 'Back to black\n\n' } })
  // Q.add({ func: docsInteraction.pasteText('1A2A3A4A5A6A7A8A9A10A'), params: { _: '1A2A3A4A5A6A7A8A9A10A' } })
  // Q.add({ func: docsInteraction.pressKey('ArrowLeft', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac }), params: { _: 'ArrowLeft', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac } } })
  // Q.add({ func: docsInteraction.jumpTo('A', 7), params: { _: 'A', 7 } })
  // Q.add({ func: docsInteraction.pasteText('|I was here|'), params: { _: '|I was here|' } })
  // Q.add({ func: docsInteraction.pressKey('ArrowRight', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac }), params: { _: 'ArrowRight', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac } } })
  // Q.add({ func: docsInteraction.pressKey('Enter', {}, 2), params: { _: 'Enter', {}, 2 } })
  // Q.add({ func: docsInteraction.pasteText('A10A98A7A6A5A4A3A2A1A OtherBloatText'), params: { _: 'A10A98A7A6A5A4A3A2A1A OtherBloatText' } })
  // Q.add({ func: docsInteraction.jumpTo('A', 5, false), params: { _: 'A', 5, false } })
  // Q.add({ func: docsInteraction.pasteText('|I was here|'), params: { _: '|I was here|' } })
  // Q.add({ func: docsInteraction.pressKey('ArrowRight', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac }), params: { _: 'ArrowRight', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac } } })
  // Q.add({ func: docsInteraction.pressKey('Enter', {}, 2), params: { _: 'Enter', {}, 2 } })
  // Q.add({ func: docsInteraction.pasteText('aaaaaAaaaaAaa'), params: { _: 'aaaaaAaaaaAaa' } })
  // Q.add({ func: docsInteraction.pressKey('ArrowLeft', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac }), params: { _: 'ArrowLeft', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac } } })
  // Q.add({ func: docsInteraction.jumpTo('A'), params: { _: 'A' } })
  // Q.add({ func: docsInteraction.pasteText('|I was here|'), params: { _: '|I was here|' } })
}
