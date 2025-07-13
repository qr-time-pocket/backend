import { Router } from "express";
import { container } from "tsyringe";
import { AuthService } from "../services/AuthService";

const router = Router();

// GET /auth/profile
router.get("/profile", (req, res) => {
  res.json({ message: "Auth profile endpoint", domain: "auth" });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { code } = req.body;

  try {
    const authService = container.resolve(AuthService);
    const result = await authService.loginWithKakao(code);

    res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /auth/logout
router.post("/logout", async (req, res) => {
  try {
    const { userId } = req.body;
    const authService = container.resolve(AuthService);
    const result = await authService.logout(userId);

    res.json(result);
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
