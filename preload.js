const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ballfish',
    {
        projectPath: process.execPath,
        require: require
    }
)