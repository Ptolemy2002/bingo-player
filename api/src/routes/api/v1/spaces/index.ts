import { Router } from "express";
import getAllSpacesRouter from "./get/all";
import countAllSpacesRouter from "./count/all";
import listAllSpacePropValuesRouter from "./list-prop/all";
import getSpacesByPropRouter from "./get/by-prop";
import countSpacesByPropRouter from "./count/by-prop";

const router = Router();

router.use("/", getAllSpacesRouter);
router.use("/", countAllSpacesRouter);
router.use("/", listAllSpacePropValuesRouter);
// Don't include the option to delete all spaces, as that would be a bad idea in production.

router.use("/", getSpacesByPropRouter);
router.use("/", countSpacesByPropRouter);

const spacesRouter = router;
export default spacesRouter;