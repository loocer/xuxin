export default class Pools {
  constructor() {
    this.pool = new Map();
  }
  getItemByClass(className,Class){
    if(this.pool.has(className)){
      let poolList = this.pool.get(className)
      let result = (poolList.length
        ? poolList.shift()
        : new Class())
      return result
    }else{
      return new Class()
    }
  }
  recover(className, instance) {
    if (this.pool.has(className)) {
      this.pool.get(className).push(instance)
    } else {
      this.pool.set(className, [instance])
    }
  }
}