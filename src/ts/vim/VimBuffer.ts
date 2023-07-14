import { SpecialRegisters, SpecialRegistersValueTypes } from '../types/vimTypes'

export default class VimBuffer {
  // eslint-disable-next-line no-use-before-define
  private static _instance: VimBuffer
  private readonly bufferMap: Map<SpecialRegisters, SpecialRegistersValueTypes<keyof typeof SpecialRegisters>>

  private constructor() {
    this.bufferMap = new Map<SpecialRegisters, SpecialRegistersValueTypes<keyof typeof SpecialRegisters>>()
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  public get buffer() {
    return this.bufferMap
  }

  public addToBuffer<T extends keyof typeof SpecialRegisters>({
    buffer,
    value,
  }: {
    buffer: T
    value: SpecialRegistersValueTypes<T>
  }): void {
    this.bufferMap.set(buffer as SpecialRegisters, value as SpecialRegistersValueTypes<keyof typeof SpecialRegisters>)
  }
}
