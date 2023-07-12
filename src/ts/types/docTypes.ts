export type Color = 'black' | 'grey' | 'white' | 'red' | 'yellow' | 'purple' | 'green' | 'blue'

export type ErrorString = string & { __brand: 'error' }
