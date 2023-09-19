import express from "express";
import { linkUser } from "./middlewares";

const router = express.Router();

router.get("/:userID", linkUser, async (req, res) => {
    res.json({
        user: req.user,
    });
});

export default router;
