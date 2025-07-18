import { Router } from "express";
import { container } from "tsyringe";
import { AuthService } from "../services/AuthService";

const router = Router();
const authService = container.resolve(AuthService);

// GET /auth/profile
router.get("/profile", (req, res) => {
  res.json({ message: "Auth profile endpoint", domain: "auth" });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { code } = req.body;

  try {
    const result = await authService.loginWithKakao(code);

    res.setHeader("Set-Cookie", [
      `accessToken=${result.accessToken}; HttpOnly;  SameSite=Lax; Path=/`,
      `refreshToken=${result.refreshToken}; HttpOnly;  SameSite=Lax; Path=/`,
    ]);

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
    const result = await authService.logout(userId);

    res.json(result);
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /auth/verify-token
router.get("/verify-token", async (req, res) => {
  // 헤더에 있는 access token 검증
  try {
    const { accessToken } = req.cookies;
    const result = await authService.verifyToken(accessToken as string);

    res.json(result);
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/test/login/:id", async (req, res) => {
  const { id } = req.params;
  const result = await authService.loginWithKakao(id);
  res.json(result);
});

export default router;
