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

  /**
   * Gets the users clipboard content
   */
  public static getClipboardContent() {
    return navigator.clipboard.readText()
  }

  private constructor() {
    this.registerContent = [{ name: '*', content: '' }]
    Register.getClipboardContent()
      .then((content) => (this.registerContent[0].content = content))
      .catch((err) => {
        throw new Error(err)
      })
  }

  // Gets an instance of the Register class
  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  // Gets the current register
  public get register() {
    return this.registerContent
  }
}
