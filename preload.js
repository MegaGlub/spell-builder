const { contextBridge } = require('electron');
const SimpleCrypto = require('simple-crypto-js').default;

contextBridge.exposeInMainWorld('ballfish',
    {
        projectPath: process.execPath,
        require: require,

        encrypt: (salt, text) => {
            const sCrypt = new SimpleCrypto(salt);
            return sCrypt.encrypt(text);
        },
        decrypt: (salt, text) => {
            const sCrypt = new SimpleCrypto(salt);
            return sCrypt.decrypt(text);
        }
    }
)