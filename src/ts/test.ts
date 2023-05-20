import docsInteraction from './docs/DocsInteraction'
import { VIM } from './main'
import CommandQueue from './vim/CommandQueue'

function styleTest(Queue: CommandQueue) {
  Queue.add({ func: docsInteraction.toggleBold, params: [], delay: 5 })
  Queue.add({ func: docsInteraction.pasteText, params: { text: '\n\nStyle Test\n\n' } })
  Queue.add({ func: docsInteraction.toggleBold, params: [], delay: 5 })
  Queue.add({ func: docsInteraction.pasteText, params: { text: "This text shouldn't be bold\n\n" }, delay: 5 })
  Queue.add({ func: docsInteraction.toggleBold, params: [], delay: 5 })
  Queue.add({ func: docsInteraction.pasteText, params: { text: 'This text should be bold\n\n' }, delay: 5 })
  Queue.add({ func: docsInteraction.toggleBold, params: [] })
  Queue.add({ func: docsInteraction.pasteText, params: { text: "This text shouldn't be bold\n\n" } })

  Queue.add({ func: docsInteraction.toggleItalic, params: [] })
  Queue.add({ func: docsInteraction.pasteText, params: { text: 'This text should be italic\n\n' } })
  Queue.add({ func: docsInteraction.toggleItalic, params: [] })
  Queue.add({ func: docsInteraction.pasteText, params: { text: "This text shouldn't be italic\n\n" } })

  Queue.add({ func: docsInteraction.toggleUnderline, params: [] })
  Queue.add({ func: docsInteraction.pasteText, params: { text: 'This text should be underlined\n\n' } })
  Queue.add({ func: docsInteraction.toggleUnderline, params: [] })
  Queue.add({ func: docsInteraction.pasteText, params: { text: "This text shouldn't be underlined\n\n" } })
}

function colorTest(Queue: CommandQueue) {
  Queue.add({ func: docsInteraction.toggleBold, params: [], delay: 5 })
  Queue.add({ func: docsInteraction.pasteText, params: { text: '\n\nColor Test\n\n' } })
  Queue.add({ func: docsInteraction.toggleBold, params: [], delay: 5 })
  Queue.add({ func: docsInteraction.pickColor, params: { color: 'red' } })
  Queue.add({ func: docsInteraction.pasteText, params: { text: 'This text should be red\n\n' } })
  Queue.add({ func: docsInteraction.pickColor, params: { color: 'green' } })
  Queue.add({ func: docsInteraction.pasteText, params: { text: 'This text should be green\n\n' } })
  Queue.add({ func: docsInteraction.pickColor, params: { color: 'purple' } })
  Queue.add({ func: docsInteraction.pasteText, params: { text: 'This text should be purple\n\n' } })
  Queue.add({ func: docsInteraction.pickColor, params: { color: 'black' } })
  Queue.add({ func: docsInteraction.pasteText, params: { text: 'Back to black\n\n' } })
}

function jumpTest(Queue: CommandQueue) {
  Queue.add({ func: docsInteraction.toggleBold, params: [], delay: 5 })
  Queue.add({ func: docsInteraction.pasteText, params: { text: '\n\nJump Test' } })
  Queue.add({ func: docsInteraction.toggleBold, params: [], delay: 5 })

  Queue.add({ func: docsInteraction.pasteText, params: { text: '\n\nabcdefghijklmnopqrstuvwxyz' } })
  Queue.add({ func: docsInteraction.pressKey, params: { key: 'Home' } })
  Queue.add({
    func: docsInteraction.jumpTo,
    params: { target: 'm' },
    delay: 1000,
  })
  Queue.add({
    func: docsInteraction.jumpTo,
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

function homeEndTest(Queue: CommandQueue) {
  Queue.add({ func: docsInteraction.toggleBold, params: [], delay: 100 })
  Queue.add({ func: docsInteraction.pasteText, params: { text: '\n\nHome - End Test\n\n' } })
  Queue.add({ func: docsInteraction.toggleBold, params: [], delay: 5 })

  Queue.add({ func: docsInteraction.pasteText, params: { text: 'abcdefghijklmnopqrstuvwxyz' } })
  Queue.add({ func: docsInteraction.pressKey, params: { key: 'Home' } })
  Queue.add({ func: docsInteraction.pasteText, params: { text: '|START|' } })
  Queue.add({ func: docsInteraction.pressKey, params: { key: 'End' } })
  Queue.add({ func: docsInteraction.pasteText, params: { text: '|END|' } })
}

export default function test(suite?: ('home' | 'jump' | 'color' | 'style')[]) {
  const Queue = VIM.CommandQueue
  if (!suite) return
  docsInteraction.clearDocument({})
  Queue.add({ func: docsInteraction.pasteText, params: { text: 'Starting Tests' } })
  if (suite.includes('style')) styleTest(Queue)
  if (suite.includes('color')) colorTest(Queue)
  if (suite.includes('jump')) jumpTest(Queue)
  if (suite.includes('home')) homeEndTest(Queue)
}
