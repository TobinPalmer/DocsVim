export enum VimMode {
  'normal' = 'normal',
  'insert' = 'insert',
  'visual' = 'visual',
  'visualLine' = 'visualLine',
  'command' = 'command',
  'running' = 'running',
}

export interface KeyboardOpts {
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  mac?: boolean
}
