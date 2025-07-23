import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { AuthService } from "../../auth/AuthService";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

// 인증이 필요하지 않은 경로들
const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/profile",
  "/auth/test/login",
  // "/academy",
  "/hello",
];

// 경로가 공개 경로인지 확인하는 함수
function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath));
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 공개 경로는 인증 검사 건너뛰기
  if (isPublicPath(req.path)) {
    return next();
  }

  const handleAuth = async () => {
    try {
      const authService = container.resolve(AuthService);
      const { accessToken, refreshToken } = req.cookies;

      // 1. access token이 있는지 확인
      if (!accessToken) {
        return res.status(401).json({ message: "Access token required" });
      }

      try {
        // 2. access token 검증
        const decoded = await authService.verifyToken(accessToken);
        (req as AuthenticatedRequest).user = decoded;
        return next();
      } catch (accessTokenError) {
        console.log("Access token expired or invalid:", accessTokenError);

        // 3. access token이 만료된 경우, refresh token 확인
        if (!refreshToken) {
          return clearCookiesAndRedirect(res);
        }

        try {
          // 4. refresh token 검증 및 새 access token 발급
          const user = await authService.validateRefreshToken(refreshToken);
          const newTokens = await authService.createTokens(user.id);

          // 5. 새로운 토큰을 쿠키에 설정
          res.setHeader("Set-Cookie", [
            `accessToken=${newTokens.accessToken}; HttpOnly; SameSite=Lax; Path=/`,
            `refreshToken=${newTokens.refreshToken}; HttpOnly; SameSite=Lax; Path=/`,
          ]);

          // 6. 사용자 정보를 request에 추가하고 계속 진행
          (req as AuthenticatedRequest).user = { sub: user.id, type: "access" };
          return next();
        } catch (refreshTokenError) {
          console.log("Refresh token expired or invalid:", refreshTokenError);
          return clearCookiesAndRedirect(res);
        }
      }
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  handleAuth();
};

function clearCookiesAndRedirect(res: Response) {
  res.setHeader("Set-Cookie", [
    "accessToken=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
    "refreshToken=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
  ]);

  return res.status(401).json({
    message: "Authentication required",
    redirectTo: "/login",
  });
}
