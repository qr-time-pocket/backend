import { Router } from "express";
import { container } from "tsyringe";
import { AcademyService } from "../services/academyService";

const router = Router();
const academyService = container.resolve(AcademyService);

router.post("/", async (req, res) => {
  await academyService.createAcademy(req.body);
});

export default router;
