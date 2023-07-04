/* eslint-disable @typescript-eslint/no-empty-function */

import Command from './Command'

const commands = {
  quit: () => {},
  write: () => Command.showInfo('Written'),
}

export default commands
