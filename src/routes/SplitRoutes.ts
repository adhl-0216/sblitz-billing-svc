import { Request, Response, Router } from 'express';

const router = Router();

// Create bill member (implement similarly)
router.post("/:billId/member", (req, res) => { /* ... */ });
// Read member
router.get("/:billId/member/:memberId", (req, res) => { /* ... */ });
// Update member
router.put("/:billId/member/:memberId", (req, res) => { /* ... */ });
// Delete member
router.delete("/:billId/member/:memberId", (req, res) => { /* ... */ });

export default router;
