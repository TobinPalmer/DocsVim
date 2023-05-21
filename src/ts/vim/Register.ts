interface RegisterContent {
  name: string
  content: string | Blob
}

/**
 * Register class handles the vim clipboard which is seperate from the system clipboard
 */
export default class Register {
  // eslint-disable-next-line no-use-before-define
  private static _instance: Register
  private readonly registerContent: RegisterContent[]

  public static getClipboardContent() {
    return navigator.clipboard.readText()
  }

  private constructor() {
    this.registerContent = [{ name: '*', content: '' }]
    Register.getClipboardContent().then((content) => (this.registerContent[0].content = content))
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  public get register() {
    return this.registerContent
  }
}
