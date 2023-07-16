import { Keys } from '../input/FormatKey'

export enum VimMode {
  NORMAL = 'NORMAL',
  INSERT = 'INSERT',
  VISUAL = 'VISUAL',
  VISUAL_LINE = 'VISUAL_LINE',
  COMMAND = 'COMMAND',
}

export enum VimRegisters {
  DEFAULT = 'DEFAULT',
}

export enum VimBreakCodes {
  'find' = 'FIND',
  'macro' = 'MACRO',
  'macro_register' = 'MACRO_REGISTER',
  'wrap' = 'WRAP',
  'g' = 'g',
}

export enum PlaybackStatus {
  PLAYING = 'playing',
  RECORDING = 'recording',
  STOPPED = 'stopped',
}

export interface MacroStatus {
  playbackStatus: PlaybackStatus
  register: string
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

export enum CopyTypes {
  TEXT = 'Text',
  FULL_LINE = 'FullLine',
}

export interface RegisterContent {
  type: CopyTypes
  content: ClipboardContent | null
}

export enum SpecialRegisters {
  'DEFAULT' = '"',
  'LAST_INSERT' = '.',
  'LAST_EDIT' = '^',
  'LAST_YANK' = '*',
  'LAST_SEARCH' = '/',
  'LAST_COMMAND' = ':',
  'LAST_COMMAND_KEYS' = 'test_string',
  'MACRO' = '@',
}

export type LAST_COMMAND = {
  repeat: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: (...args: any[]) => void
  params: string[]
}

export type LAST_COMMAND_KEYS = { key: string; opts: KeyboardOpts }

export type LAST_MACRO = {
  register: string
  keys: LAST_COMMAND_KEYS[]
}

interface TypeMapping {
  [SpecialRegisters.LAST_COMMAND_KEYS]: LAST_COMMAND_KEYS
  [SpecialRegisters.LAST_COMMAND]: LAST_COMMAND
  [SpecialRegisters.MACRO]: LAST_MACRO[]

  string: string
  number: number
}

// export type SpecialRegistersValueTypes<T extends keyof typeof SpecialRegisters> = {
//   [Key in T]: Key extends keyof TypeMapping ? TypeMapping[Key] : never
// }

export type SpecialRegistersValueTypes<K extends SpecialRegisters> = K extends keyof TypeMapping
  ? TypeMapping[K]
  : never
