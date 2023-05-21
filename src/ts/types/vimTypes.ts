import { Keys } from '../input/FormatKey'

// eslint-disable-next-line no-shadow
export enum VimMode {
  'normal' = 'NORMAL',
  'insert' = 'INSERT',
  'visual' = 'VISUAL',
  'visualLine' = 'VISUAL_LINE',
  'command' = 'COMMAND',
  'running' = 'RUNNING',
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
