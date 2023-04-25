import docsInteraction from './docs/docsInteraction'
import test from './test'
import Vim from './vim/Vim'
export const isMac = true
export const vim = new Vim('insert')
export const interactions = new docsInteraction()

export const GLOBALS = Object.freeze({
  isMac: true,
  vim: new Vim('insert'),
  interactions: new docsInteraction(),
})

test()
