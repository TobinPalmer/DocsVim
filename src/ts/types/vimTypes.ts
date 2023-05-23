import { Keys } from '../input/FormatKey'

// eslint-disable-next-line no-shadow
export enum VimMode {
  NORMAL = 'NORMAL',
  INSERT = 'INSERT',
  VISUAL = 'VISUAL',
  VISUAL_LINE = 'VISUAL_LINE',
  COMMAND = 'COMMAND',
  RUNNING = 'RUNNING',
}

// eslint-disable-next-line no-shadow
export enum VimRegisters {
  LINE = 'LINE',
  DEFAULT = 'DEFAULT',
}

// eslint-disable-next-line no-shadow
export enum VimBreakCodes {
  'find' = 'FIND',
}

export type KeyboardOpts = Partial<{
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  altKey: boolean
  mac: boolean
  afterKeys: { key: keyof Keys; opts: KeyboardOpts }[]
}>
