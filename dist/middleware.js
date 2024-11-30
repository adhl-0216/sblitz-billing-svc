"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoutesMiddleware = void 0;
exports.corsMiddleware = corsMiddleware;
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
function corsMiddleware() {
    return (0, cors_1.default)({
        origin: process.env.WEBSITE_DOMAIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
    });
}
;
const protectedRoutesMiddleware = () => {
    return async (req, res, next) => {
        try {
            const data = await validateAuth(req);
            if (data?.userId) {
                req.headers['x-user-id'] = data.userId;
                next();
            }
            else {
                res.status(401).send('Unauthorized: Invalid session');
            }
        }
        catch (error) {
            console.error('Error validating session:', error);
            res.status(500).send('Internal Server Error');
        }
    };
};
exports.protectedRoutesMiddleware = protectedRoutesMiddleware;
const validateAuth = async (req) => {
    try {
        const nginxBaseUrl = process.env.NGINX_BASE_URL || 'http://nginx:8080';
        const response = await axios_1.default.get(`${nginxBaseUrl}/api/auth/validate`, {
            headers: {
                Cookie: req.headers.cookie, // Forwarding the original client cookies
            },
            withCredentials: true,
        });
        if (response.status === 200 && response.data?.userId) {
            return response.data;
        }
        else {
            throw new Error('Unauthorized: Invalid session');
        }
    }
    catch (error) {
        console.error('Error validating session:', error);
        throw new Error('Internal Server Error');
    }
};
//# sourceMappingURL=middleware.js.map