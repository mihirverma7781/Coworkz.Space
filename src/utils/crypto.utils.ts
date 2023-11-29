import crypt from "bcrypt";

export default class CryptoUtils {
  hashPlainText(text: string) {
    try {
      const saltRounds = 10;
      const salt = crypt.genSaltSync(saltRounds);
      const hash = crypt.hashSync(text, salt);
      return hash;
    } catch (error) {
      throw error;
    }
  }

  comparePlainText(plainText: string, hash: string) {
    try {
      const matching = crypt.compareSync(plainText, hash);
      return matching;
    } catch (error) {
      throw error;
    }
  }
}
