export enum vimMode {
  'normal' = 'normal',
  'insert' = 'insert',
  'visual' = 'visual',
  'visualLine' = 'visualLine',
  'command' = 'command',
  'running' = 'running',
}

export interface keyboardOpts {
  ctrlKey?: boolean
  shiftKey?: boolean
  mac?: boolean
}
