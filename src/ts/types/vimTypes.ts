import { Keys } from '../input/FormatKey'

// eslint-disable-next-line no-shadow
export enum VimMode {
  NORMAL = 'NORMAL',
  INSERT = 'INSERT',
  VISUAL = 'VISUAL',
  VISUAL_LINE = 'VISUAL_LINE',
  COMMAND = 'COMMAND',
}

// eslint-disable-next-line no-shadow
export enum VimRegisters {
  DEFAULT = 'DEFAULT',
}

// eslint-disable-next-line no-shadow
export enum VimBreakCodes {
  'find' = 'FIND',
}

export type ClipboardContent = string & { __brand: 'clipboardContent' }

export type KeyboardOpts = Partial<{
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  altKey: boolean
  mac: boolean
  afterKeys: { key: keyof Keys; opts: KeyboardOpts }[]
}>

// eslint-disable-next-line no-shadow
export enum CopyTypes {
  TEXT = 'Text',
  FULL_LINE = 'FullLine',
}

export interface RegisterContent {
  type: CopyTypes
  content: ClipboardContent | null
}
