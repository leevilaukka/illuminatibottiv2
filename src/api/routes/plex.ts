import { Router } from "express";
import { getAllLibraries, getItemByID, getLibraryByID } from "../handlers/plex";

const router = Router();

router.get("/libraries", async (req, res) => {
    res.json(await getAllLibraries())
});

router.get("/library/:id", async (req, res) => {
    const id = req.params.id

    res.json(await getLibraryByID(id))
})

router.get("/item/:id", async (req, res) => {
    const { id } = req.params

    res.json(await getItemByID(id))
})

export default router;
