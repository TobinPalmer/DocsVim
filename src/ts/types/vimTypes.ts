// eslint-disable-next-line no-shadow
export enum VimMode {
  'normal' = 'NORMAL',
  'insert' = 'INSERT',
  'visual' = 'VISUAL',
  'visualLine' = 'VISUAL_LINE',
  'command' = 'COMMAND',
  'running' = 'RUNNING',
}

export interface KeyboardOpts {
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  mac?: boolean
}
