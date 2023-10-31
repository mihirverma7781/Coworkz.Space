export default class GlobalUtils {
  isIndianMobileNumber(value: string) {
    // Regular expression to match a 10-digit Indian mobile number
    const mobileNumberPattern = /^[6789]\d{9}$/;
    return mobileNumberPattern.test(value);
  }

  isUUID(value: string): boolean {
    const uuidPattern =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidPattern.test(value);
  }
}
