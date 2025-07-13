# QR Backend with Service Layer & TSyringe

이 프로젝트는 Express.js와 TypeScript를 사용하여 service layer 패턴과 TSyringe 의존성 주입을 적용한 백엔드 애플리케이션입니다.

## 🏗️ 아키텍처

### Service Layer Pattern

비즈니스 로직을 컨트롤러에서 분리하여 service layer에 배치했습니다:

```
src/
├── controllers/     # HTTP 요청/응답 처리
├── services/        # 비즈니스 로직
├── types/          # TypeScript 타입 정의
└── index.ts        # 애플리케이션 진입점
```

### 의존성 주입 (TSyringe)

TSyringe를 사용하여 의존성을 관리합니다:

- `@injectable()`: 클래스를 의존성 주입 컨테이너에 등록
- `@inject()`: 의존성 주입
- `container.resolve()`: 런타임에 인스턴스 생성

## 📁 Service Layer 구조

### 1. DatabaseService

```typescript
@injectable()
export class DatabaseService {
  private prisma: PrismaClient;

  getPrisma(): PrismaClient {
    return this.prisma;
  }
}
```

- Prisma 클라이언트 관리
- 다른 서비스들이 데이터베이스에 접근할 수 있도록 제공

### 2. KakaoAuthService

```typescript
@injectable()
export class KakaoAuthService {
  async exchangeCodeForToken(code: string): Promise<KakaoLoginResponse>;
  async getUserInfo(accessToken: string);
}
```

- 카카오 OAuth 관련 로직
- 토큰 교환 및 사용자 정보 조회

### 3. UserService

```typescript
@injectable()
export class UserService {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService,
    @inject(KakaoAuthService) private kakaoAuthService: KakaoAuthService
  ) {}

  async findOrCreateUserByKakao(kakaoUserInfo: any)
  async getUserById(userId: string)
  async updateUserProfile(userId: string, data: {...})
}
```

- 사용자 관리 비즈니스 로직
- 카카오 로그인 사용자 생성/조회
- 프로필 업데이트

### 4. AuthService

```typescript
@injectable()
export class AuthService {
  constructor(
    @inject(KakaoAuthService) private kakaoAuthService: KakaoAuthService,
    @inject(UserService) private userService: UserService,
    @inject(DatabaseService) private databaseService: DatabaseService
  ) {}

  async loginWithKakao(code: string);
  async logout(userId: string);
  async validateRefreshToken(token: string);
}
```

- 인증 관련 비즈니스 로직
- 카카오 로그인 처리
- 로그아웃 및 토큰 검증

### 5. GroupService

```typescript
@injectable()
export class GroupService {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService
  ) {}

  async getAllGroups()
  async getGroupById(id: string)
  async createGroup(data: {...})
  async updateGroup(id: string, data: {...})
  async deleteGroup(id: string)
}
```

- 그룹 관리 비즈니스 로직
- CRUD 작업 처리

## 🔧 사용법

### 1. 서비스 인스턴스 생성

```typescript
import { container } from "tsyringe";
import { AuthService } from "./services/AuthService";

const authService = container.resolve(AuthService);
```

### 2. 컨트롤러에서 서비스 사용

```typescript
router.post("/login", async (req, res) => {
  try {
    const authService = container.resolve(AuthService);
    const result = await authService.loginWithKakao(req.body.code);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
```

## 🚀 실행

```bash
# 개발 서버 실행
npm run dev

# Docker 실행
npm run run:docker
```

## 📋 API 엔드포인트

### Auth

- `POST /auth/login` - 카카오 로그인
- `POST /auth/logout` - 로그아웃
- `GET /auth/profile` - 프로필 조회

### User

- `GET /user/profile?userId=xxx` - 사용자 프로필 조회
- `PUT /user/profile` - 사용자 프로필 업데이트

### Group

- `GET /group` - 모든 그룹 조회
- `GET /group/:id` - 특정 그룹 조회
- `POST /group` - 그룹 생성
- `PUT /group/:id` - 그룹 수정
- `DELETE /group/:id` - 그룹 삭제

## 🎯 장점

1. **관심사 분리**: 비즈니스 로직이 컨트롤러에서 분리됨
2. **재사용성**: 서비스는 여러 컨트롤러에서 재사용 가능
3. **테스트 용이성**: 각 서비스를 독립적으로 테스트 가능
4. **의존성 관리**: TSyringe로 의존성을 명시적으로 관리
5. **확장성**: 새로운 서비스 추가가 용이함

## 🔄 의존성 주입 흐름

```
Controller → Service → DatabaseService → Prisma Client
     ↓           ↓           ↓
  HTTP 요청 → 비즈니스 로직 → 데이터베이스
```

이 구조를 통해 각 계층의 책임이 명확히 분리되고, 코드의 유지보수성과 테스트 가능성이 향상됩니다.
