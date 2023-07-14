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
  'wrap' = 'WRAP',
  'g' = 'g',
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

// eslint-disable-next-line no-shadow
export enum SpecialRegisters {
  'DEFAULT' = '"',
  'LAST_INSERT' = '.',
  'LAST_EDIT' = '^',
  'LAST_YANK' = '*',
  'LAST_SEARCH' = '/',
  'LAST_COMMAND' = ':',
  'LAST_COMMAND_KEYS' = 'test_string',
  'LAST_MACRO' = '@',
}

export type LAST_COMMAND = {
  repeat: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: (...args: any[]) => void
  params: string[]
}

export type LAST_COMMAND_KEYS = { key: string; opts: KeyboardOpts }

interface TypeMapping {
  LAST_COMMAND_KEYS: LAST_COMMAND_KEYS
  LAST_COMMAND: LAST_COMMAND
  string: string
  number: number
}

// export type SpecialRegistersValueTypes<T extends keyof typeof SpecialRegisters> = {
//   [Key in T]: Key extends keyof TypeMapping ? TypeMapping[Key] : never
// }

export type SpecialRegistersValueTypes<K extends keyof typeof SpecialRegisters> = K extends keyof TypeMapping
  ? TypeMapping[K]
  : never
