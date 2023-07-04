import DocsInteractions from './docs/DocsInteractions'
import { VIM } from './main'
import { VimRegisters } from './types/vimTypes'
import CommandQueue from './vim/CommandQueue'

// Tests style commands (bold, italic, etc.)
function styleTest(Queue: CommandQueue) {
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 5 })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: '\n\nStyle Test\n\n' },
  })
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 5 })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: "This text shouldn't be bold\n\n" },
    delay: 5,
  })
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 5 })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: 'This text should be bold\n\n' },
    delay: 5,
  })
  Queue.add({ func: DocsInteractions.toggleBold, params: [] })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: "This text shouldn't be bold\n\n" },
  })

  Queue.add({ func: DocsInteractions.toggleItalic, params: [] })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: 'This text should be italic\n\n' },
  })
  Queue.add({ func: DocsInteractions.toggleItalic, params: [] })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: "This text shouldn't be italic\n\n" },
  })

  Queue.add({ func: DocsInteractions.toggleUnderline, params: [] })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: 'This text should be underlined\n\n' },
  })
  Queue.add({ func: DocsInteractions.toggleUnderline, params: [] })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: "This text shouldn't be underlined\n\n" },
  })
}

// Tests changing colors
function colorTest(Queue: CommandQueue) {
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 5 })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: '\n\nColor Test\n\n' },
  })
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 5 })
  Queue.add({ func: DocsInteractions.pickColor, params: { color: 'red' } })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: 'This text should be red\n\n' },
  })
  Queue.add({ func: DocsInteractions.pickColor, params: { color: 'green' } })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: 'This text should be green\n\n' },
  })
  Queue.add({ func: DocsInteractions.pickColor, params: { color: 'purple' } })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: 'This text should be purple\n\n' },
  })
  Queue.add({ func: DocsInteractions.pickColor, params: { color: 'black' } })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: 'Back to black\n\n' },
  })
}
// Tests jumping to a character
function copyTest(Queue: CommandQueue) {
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 5 })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: '\n\nCopy Text' },
  })
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 5 })

  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: '\n\nfoidajsfoisjfoiads' },
  })
  Queue.add({ func: DocsInteractions.pressKey, params: { key: 'Home' } })
  Queue.add({ func: DocsInteractions.copyCurrentLine, params: { fullLine: true } })
  Queue.add({ func: DocsInteractions.pasteFromRegister, params: { register: VimRegisters.DEFAULT } })
}

// Tests jumping to a character
function jumpTest(Queue: CommandQueue) {
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 5 })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: '\n\nJump Test' },
  })
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 5 })

  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: '\n\nabcdefghijklmnopqrstuvwxyz' },
  })
  Queue.add({ func: DocsInteractions.pressKey, params: { key: 'Home' } })
  Queue.add({
    func: DocsInteractions.jumpTo,
    params: { target: 'm' },
    delay: 1000,
  })
  Queue.add({
    func: DocsInteractions.jumpTo,
    params: { target: 'x' },
    delay: 1000,
  })
  // Queue.add({ func: docsInteraction.jumpTo, params: { target: 'x' }, delay: 200 })
  // Queue.add({ func: docsInteraction.jumpTo, params: { target: 'd', forward: false }, delay: 200 })
  // Queue.add({ func: docsInteraction.jumpTo, params: { target: 'z' }, delay: 200 })
  // Queue.add({ func: docsInteraction.jumpTo, params: { target: 'a', forward: false }, delay: 200 })
  // Queue.add({ func: docsInteraction.jumpTo, params: { target: 'm' }, delay: 200 })
  // Queue.add({ func: docsInteraction.jumpTo, params: { target: 'd', forward: false }, delay: 200 })
}

// Tests using the home and end keys of different keyboards / OS
function homeEndTest(Queue: CommandQueue) {
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 100 })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: '\n\nHome - End Test\n\n' },
  })
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 5 })

  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: 'abcdefghijklmnopqrstuvwxyz' },
  })
  Queue.add({ func: DocsInteractions.pressKey, params: { key: 'Home' } })
  Queue.add({ func: DocsInteractions.pasteText, params: { text: '|START|' } })
  Queue.add({ func: DocsInteractions.pressKey, params: { key: 'End' } })
  Queue.add({ func: DocsInteractions.pasteText, params: { text: '|END|' } })
}

// Tests pasting and copying to and from the clipboard
function pasteTest(Queue: CommandQueue) {
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 100 })
  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: '\n\nPaste Test\n\n' },
  })
  Queue.add({ func: DocsInteractions.toggleBold, params: [], delay: 25 })

  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: 'abcdefghijklmnopqrstuvwxyz\n\n' },
  })

  // eslint-disable-next-line no-magic-numbers
  const nonce = Math.random().toString(36)
  console.log(nonce)

  Queue.add({
    func: DocsInteractions.pasteText,
    params: { text: nonce },
  })

  Queue.add({
    func: DocsInteractions.copyCurrentLine,
    params: {},
  })

  DocsInteractions.copyCurrentLine({ fullLine: true }).then(() => {
    Queue.add({
      func: DocsInteractions.pressKey,
      params: { key: 'End' },
    })
    Queue.add({
      func: DocsInteractions.pasteText,
      params: { text: 'Pasting from register\n\n' },
    })

    Queue.add({
      func: DocsInteractions.pasteFromRegister,
      params: { register: VimRegisters.DEFAULT },
    })
  })
  // setTimeout(() => {
  //   console.log('Text Cooler', VIM.Register.register.get(VimRegisters.DEFAULT))
  //   // eslint-disable-next-line no-magic-numbers
  // }, 2000)

  // Queue.add({
  //   func: DocsInteractions.pasteFromRegister,
  //   params: { register: VimRegisters.DEFAULT },
  // })
}

// Test Function
export default function docsTest(suite?: ('home' | 'jump' | 'color' | 'style' | 'copy' | 'paste')[]) {
  const Queue = VIM.CommandQueue
  if (!suite) return
  DocsInteractions.clearDocument({})
  // Queue.add({ func: DocsInteractions.pasteText, params: { text: 'Starting Tests' } })
  if (suite.includes('style')) styleTest(Queue)
  if (suite.includes('color')) colorTest(Queue)
  if (suite.includes('jump')) jumpTest(Queue)
  if (suite.includes('home')) homeEndTest(Queue)
  if (suite.includes('copy')) copyTest(Queue)
  if (suite.includes('paste')) pasteTest(Queue)
}
