import { Router } from "express";
import getAllSpacesRouter from "./get/all";
import countAllSpacesRouter from "./count/all";
import listAllSpacePropValuesRouter from "./list-prop/all";
import getSpacesByPropRouter from "./get/by-prop";
import countSpacesByPropRouter from "./count/by-prop";
import listSpacePropValuesByPropRouter from "./list-prop/by-prop";
import searchSpacesRouter from "./search/get";
import searchSpacesCountRouter from "./search/count";
import searchSpacesListPropRouter from "./search/list-prop";
import getSpaceByExactIDRouter from "./get/by-exact-id";

const router = Router();

router.use("/", getAllSpacesRouter);
router.use("/", getSpaceByExactIDRouter);
router.use("/", countAllSpacesRouter);
router.use("/", listAllSpacePropValuesRouter);
// Don't include the option to delete all spaces, as that would be a bad idea in production.

router.use("/", getSpacesByPropRouter);
router.use("/", countSpacesByPropRouter);
router.use("/", listSpacePropValuesByPropRouter);

router.use("/", searchSpacesRouter);
router.use("/", searchSpacesCountRouter);
router.use("/", searchSpacesListPropRouter);

const spacesRouter = router;
export default spacesRouter;