// Coupon Object
// whenBuying = null -> No condition for coupon - add it and save
export default class Coupon {
  constructor(code, dollarsSaved, whenBuying = []) {
    this.code = code;
    this.whenBuying = whenBuying;
    this.dollarsSaved = dollarsSaved;
  }
}
