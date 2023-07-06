const CryptoJS = require("crypto-js");
let DATA_ENCRYPT="BkivYts45Ryurg8P"


  const encrypt = async(plainText) => {
    let _key = CryptoJS.enc.Utf8.parse(DATA_ENCRYPT);
    let _iv = CryptoJS.enc.Utf8.parse(DATA_ENCRYPT);
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(plainText), _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    encrypted = encrypted.toString();
    return encrypted;
  };

  const decrypt = async(strToDecrypt) => {
    let _key = CryptoJS.enc.Utf8.parse(DATA_ENCRYPT);
    let _iv = CryptoJS.enc.Utf8.parse(DATA_ENCRYPT);
    let decrypted = CryptoJS.AES.decrypt(strToDecrypt, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  };


module.exports= {encrypt, decrypt}