export enum vimMode {
  'normal' = 'normal',
  'insert' = 'insert',
  'visual' = 'visual',
  'visualLine' = 'visualLine',
  'command' = 'command',
}

export interface keyboardOpts {
  ctrlKey?: boolean
  shiftKey?: boolean
  mac?: boolean
}
