// Coupon Object
// whenBuying = null -> No condition for coupon - add it and save
export default class Coupon {
  constructor(coupon, dollarsSaved, whenBuying = []) {
    this.couponCode = coupon;
    this.whenBuying = whenBuying;
    this.dollarsSaved = dollarsSaved;
  }
}
