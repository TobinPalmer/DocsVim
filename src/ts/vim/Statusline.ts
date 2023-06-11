import { VIM } from '../main'
import Command from './Command'

export default class Statusline {
  // eslint-disable-next-line no-use-before-define
  private static _instance: Statusline
  private readonly elem: HTMLDivElement = document.createElement('div')
  private readonly cssElem: HTMLStyleElement = document.createElement('style')

  private constructor() {
    this.elem.classList.add('statusline')
    this.cssElem.innerHTML = this.css
    document.body.appendChild(this.elem)
    document.body.appendChild(this.cssElem)
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  /**
   * Updates the statusline
   */
  public update(): void {
    this.elem.innerHTML = `
    -- ${VIM.Vim.mode} --
    <div class="center error">${Command.status}</div>
    <div class="center">${VIM.Motion.commandKeys}</div>
    <div class="right">${VIM.Motion.statusString}</div>
    `
  }

  private readonly css = `
    .statusline {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        z-index: 2147483647;
        background-color: #fafbfe;
        border-top: 1px solid #c7c7c9;

        font-size: 1rem;
        align-items: center;
        padding: 0 20px;
    }
    .statusline .right {
        margin-left: auto;
        margin-right: 2rem;
    }
    .statusline .error {
      background-color: #ff0000;
      color: white;
    }
    .statusline .center {
        margin-left: 1.5rem
    }
    `
}
