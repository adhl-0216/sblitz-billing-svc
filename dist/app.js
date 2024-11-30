"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppFactory = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SplitRoutes_1 = __importDefault(require("@/routes/SplitRoutes"));
const BillRoutes_1 = __importDefault(require("@/routes/BillRoutes"));
const util_1 = require("@/util");
const middleware_1 = require("@/middleware");
const AppFactory = (config = util_1.prodConfig) => {
    const app = (0, express_1.default)();
    const PORT = config.port || 5000;
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, middleware_1.corsMiddleware)());
    app.get("/hello", (req, res) => {
        res.json({ hello: 'bitch' });
    });
    app.use((0, middleware_1.protectedRoutesMiddleware)());
    app.use(BillRoutes_1.default);
    app.use(SplitRoutes_1.default);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
exports.AppFactory = AppFactory;
(0, exports.AppFactory)();
//# sourceMappingURL=app.js.map