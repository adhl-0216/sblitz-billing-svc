"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Create bill member (implement similarly)
router.post("/:billId/member", (req, res) => { });
// Read member
router.get("/:billId/member/:memberId", (req, res) => { });
// Update member
router.put("/:billId/member/:memberId", (req, res) => { });
// Delete member
router.delete("/:billId/member/:memberId", (req, res) => { });
exports.default = router;
//# sourceMappingURL=SplitRoutes.js.map