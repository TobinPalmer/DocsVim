import { VIM } from '../main'

export default class Statusline {
  private static _instance: Statusline
  private elem: HTMLDivElement = document.createElement('div')
  private cssElem: HTMLStyleElement = document.createElement('style')

  private constructor() {
    this.elem.classList.add('statusline')
    this.cssElem.innerHTML = this.css
    document.body.appendChild(this.elem)
    document.body.appendChild(this.cssElem)
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  public update(): void {
    this.elem.innerHTML = `
    -- ${VIM.vim.mode} --
    `
  }

  private css = `
    .statusline {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 30px;
        z-index: 2147483647;
        background-color: #fafbfe;
        border-top: 1px solid #c7c7c9;

        font-size: 1rem;
        align-items: center;
        padding: 0 20px;
    }
    `
}
