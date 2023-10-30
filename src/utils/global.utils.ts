export default class GlobalUtils {
  isIndianMobileNumber(value: string) {
    // Regular expression to match a 10-digit Indian mobile number
    const mobileNumberPattern = /^[6789]\d{9}$/;
    return mobileNumberPattern.test(value);
  }
}
