import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { UserService } from "../services/UserService";

const router = Router();

// GET /user/profile
router.get("/profile", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "userId is required" });
    }

    const userService = container.resolve(UserService);
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /user/profile
router.put("/profile", async (req: Request, res: Response) => {
  try {
    const { userId, nickname, profileImage } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const userService = container.resolve(UserService);
    const updatedUser = await userService.updateUserProfile(userId, {
      nickname,
      profileImage,
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
