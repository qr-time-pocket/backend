import { Router } from "express";
import { container } from "tsyringe";
import { AuthenticatedRequest } from "../middlewares/auth";
import { AcademyService } from "../services/academyService";

const router = Router();
const academyService = container.resolve(AcademyService);

router.post("/", async (req: AuthenticatedRequest, res) => {
  await academyService.createAcademy(req.user?.sub, req.body);
  res.status(201).json({ message: "Academy created successfully" });
});

router.get("/", async (req: AuthenticatedRequest, res) => {
  const academies = await academyService.getAcademies(req.user?.sub);

  res.status(200).json(academies);
});

export default router;
