import { SpecialRegisters, SpecialRegistersValueTypes } from '../types/vimTypes'

export default class VimBuffer {
  // eslint-disable-next-line no-use-before-define
  private static _instance: VimBuffer
  private readonly bufferMap: Map<SpecialRegisters, string | number>

  private constructor() {
    this.bufferMap = new Map<SpecialRegisters, string | number>()
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  public get buffer() {
    return this.bufferMap
  }

  public addToBuffer<T extends SpecialRegisters, K extends keyof SpecialRegistersValueTypes>({
    buffer,
    value,
  }: {
    buffer: T
    value: SpecialRegistersValueTypes[K]
  }): void {
    this.bufferMap.set(buffer, value)
  }
}
