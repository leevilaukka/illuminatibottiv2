import express from "express";
import { User } from "../models";

const router = express.Router();

router.get("/:userID", async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.userID,
        },
    });

    if (!user) {
        return res.status(206).json({
            error: "User not found",
        });
    }

    res.json({
        user,
    });
});

export default router;
