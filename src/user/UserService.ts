import { inject, injectable } from "tsyringe";
import { KakaoAuthService } from "../auth/kakaoAuthService";
import { DatabaseService } from "../infrastructure/databaseService";
import { KakaoUserInfo } from "../types/auth";

@injectable()
export class UserService {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService,
    @inject(KakaoAuthService) private kakaoAuthService: KakaoAuthService
  ) {}

  async findOrCreateUserByKakao(kakaoUserInfo: KakaoUserInfo) {
    const prisma = this.databaseService.getPrisma();

    // 카카오 사용자 정보에서 필요한 데이터 추출
    const { id: kakaoId, properties } = kakaoUserInfo;

    // 기존 사용자 찾기
    let user = await prisma.user.findFirst({
      where: {
        providers: {
          some: {
            provider: "kakao",
            providerId: kakaoId.toString(),
          },
        },
      },
      include: {
        providers: true,
      },
    });

    if (!user) {
      // 새 사용자 생성
      user = await prisma.user.create({
        data: {
          nickname: properties?.nickname || null,
          profileImage: properties?.profile_image || null,
          providers: {
            create: {
              provider: "kakao",
              providerId: kakaoId.toString(),
            },
          },
        },
        include: {
          providers: true,
        },
      });
    }

    return user;
  }

  async getUserById(userId: string) {
    const prisma = this.databaseService.getPrisma();

    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        providers: true,
      },
    });
  }

  async updateUserProfile(
    userId: string,
    data: { nickname?: string; profileImage?: string }
  ) {
    const prisma = this.databaseService.getPrisma();

    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
