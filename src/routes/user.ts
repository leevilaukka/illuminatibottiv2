import express from "express";
import { checkUser } from "./middlewares";

const router = express.Router();

router.get("/:userID", checkUser, async (req, res) => {
    res.json({
        user: req.user,
    });
});

export default router;
