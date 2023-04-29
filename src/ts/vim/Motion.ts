export default class Motion {
  private motion: string[] = []

  public feedkey(key: string) {
    // if (key in this.keysThatStartMotion) {
    //   this.motion.push(key)
    // }
    console.log('feeding', key)
    console.log('the motion', this.motion)
  }
}
