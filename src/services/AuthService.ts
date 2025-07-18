import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { DatabaseService } from "./DatabaseService";
import { KakaoAuthService } from "./KakaoAuthService";
import { UserService } from "./UserService";

@injectable()
export class AuthService {
  constructor(
    @inject(KakaoAuthService) private kakaoAuthService: KakaoAuthService,
    @inject(UserService) private userService: UserService,
    @inject(DatabaseService) private databaseService: DatabaseService
  ) {}

  async loginWithKakao(code: string) {
    // 1. 카카오에서 액세스 토큰 받기
    const tokenResponse = await this.kakaoAuthService.exchangeCodeForToken(
      code
    );

    // 2. 카카오 사용자 정보 가져오기
    const kakaoUserInfo = await this.kakaoAuthService.getUserInfo(
      tokenResponse.access_token
    );

    // 3. 사용자 찾기 또는 생성
    const user = await this.userService.findOrCreateUserByKakao(kakaoUserInfo);

    // 4. 토큰 생성
    const { accessToken, refreshToken } = await this.createTokens(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async loginWithId(id: string) {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const { accessToken, refreshToken } = await this.createTokens(user.id);
    return { user, accessToken, refreshToken };
  }

  public async createTokens(userId: string) {
    const prisma = this.databaseService.getPrisma();

    // 기존 리프레시 토큰 삭제
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    // 새 리프레시 / 액세스 토큰 생성
    const accessToken = jwt.sign(
      {
        sub: userId,
        type: "access",
        // iat: Math.floor(Date.now() / 1000),
        // exp: Math.floor(Date.now() / 1000) + 1 * 60 * 60,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    // 리프레시 토큰 생성
    const refreshToken = jwt.sign(
      {
        sub: userId,
        type: "refresh",
        // iat: Math.floor(Date.now() / 1000),
        // exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "30d",
      }
    );
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30일 후 만료

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    // 액세스 토큰과 리프레시 토큰을 헤더에 추가
    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    const prisma = this.databaseService.getPrisma();

    // 사용자의 모든 리프레시 토큰 삭제
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return { message: "Logged out successfully" };
  }

  async validateRefreshToken(token: string) {
    const prisma = this.databaseService.getPrisma();

    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!refreshToken) {
      throw new Error("Invalid refresh token");
    }

    if (refreshToken.expiresAt < new Date()) {
      // 만료된 토큰 삭제
      await prisma.refreshToken.delete({
        where: { id: refreshToken.id },
      });
      throw new Error("Refresh token expired");
    }

    return refreshToken.user;
  }

  // token을 검증하는 메소드 필요
  async verifyToken(token: string) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("decoded", decoded);
    // expiresIn 확인
    // if (decoded.exp && decoded.exp < Date.now() / 1000) {
    //   throw new Error("Token expired");
    // }

    return decoded;
  }
}
