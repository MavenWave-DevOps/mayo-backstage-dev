"use strict";
exports.__esModule = true;
var getBackendConfig = function (config) {
    console.log('#######################33', config.getConfig('backend').getString('env'));
    return config.get('backend.env');
};
exports["default"] = getBackendConfig;
