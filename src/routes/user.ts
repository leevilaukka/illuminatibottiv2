import express from "express";
import { User } from "../models";
import { checkUser } from "./middlewares";

const router = express.Router();

router.get("/:userID", checkUser, async (req, res) => {
    res.json({
        user: req.user,
    });
});

export default router;
