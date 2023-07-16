import { KeyboardOpts, LAST_COMMAND_KEYS, SpecialRegisters, SpecialRegistersValueTypes } from '../types/vimTypes'

export default class VimBuffer {
  private static _instance: VimBuffer
  private readonly bufferMap: Map<SpecialRegisters, SpecialRegistersValueTypes<SpecialRegisters>>
  private readonly _macroMap: Map<string, LAST_COMMAND_KEYS[]>

  private constructor() {
    this.bufferMap = new Map<SpecialRegisters, SpecialRegistersValueTypes<SpecialRegisters>>()
    this._macroMap = new Map<string, LAST_COMMAND_KEYS[]>()
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  public get buffer() {
    return this.bufferMap
  }

  public getMacroMap() {
    return this._macroMap
  }

  public setMacroMap({ key, opts, register }: { key: string; opts: KeyboardOpts; register: string }) {
    this._macroMap.set(register, [
      ...(this._macroMap.get(register) || []),
      {
        key,
        opts,
      },
    ])
  }

  public addToBuffer<T extends SpecialRegisters>({
    buffer,
    value,
  }: {
    buffer: T
    value: SpecialRegistersValueTypes<T>
  }): void {
    this.bufferMap.set(buffer as SpecialRegisters, value as SpecialRegistersValueTypes<SpecialRegisters>)
  }
}
