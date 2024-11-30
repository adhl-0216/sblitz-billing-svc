"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConfig = exports.prodConfig = exports.devConfig = void 0;
exports.getUserId = getUserId;
exports.get_config = get_config;
function getUserId(req) {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        throw new Error('UserId not found in request headers');
    }
    return userId;
}
exports.devConfig = {
    port: 5000,
};
exports.prodConfig = {
    port: 5000,
};
exports.testConfig = {
    port: 3001,
};
function get_config() {
    const env = process.env.NODE_ENV || 'development';
    switch (env) {
        case 'production':
            return exports.prodConfig;
        case 'development':
            return exports.devConfig;
        case 'testing':
            return exports.testConfig;
        default:
            console.warn(`Unknown NODE_ENV: ${env}, defaulting to devConfig`);
            return exports.devConfig;
    }
}
//# sourceMappingURL=util.js.map