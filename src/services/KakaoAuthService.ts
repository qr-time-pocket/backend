import axios from "axios";
import { injectable } from "tsyringe";
import { KakaoLoginResponse } from "../types/auth";

@injectable()
export class KakaoAuthService {
  static baseUrl = "https://kapi.kakao.com";
  static kauthUrl = "https://kauth.kakao.com";

  private readonly clientId = "d9112c9cd8af6fedcc487e2a6086c263";
  private readonly clientSecret = "BKz22QG8qKJ6mTc8UFOS3b4bLzIsYX9P";
  private readonly redirectUri = "http://localhost:5173/oauth/kakao/callback";

  async exchangeCodeForToken(code: string): Promise<KakaoLoginResponse> {
    console.log("code", code);

    try {
      const response = await axios.post<KakaoLoginResponse>(
        `${KakaoAuthService.kauthUrl}/oauth/token`,
        null,
        {
          params: {
            grant_type: "authorization_code",
            redirect_uri: this.redirectUri,
            code: code,
            client_secret: this.clientSecret,
            client_id: this.clientId,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to exchange code for token: ${error}`);
    }
  }

  async getUserInfo(accessToken: string) {
    try {
      const response = await axios.get(
        `${KakaoAuthService.baseUrl}/v2/user/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user info: ${error}`);
    }
  }
}
