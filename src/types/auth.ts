export interface KakaoLoginResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
}

export interface KakaoUserInfo {
  id: number;
  has_signed_up?: boolean;
  connected_at?: string;
  synched_at?: string;
  properties?: {
    nickname?: string;
    profile_image?: string;
  };
  kakao_account?: KakaoAccount;
}

export interface Profile {
  nickname?: string;
  thumbnail_image_url?: string;
  profile_image_url?: string;
  is_default_image?: boolean;
  is_default_nickname?: boolean;
}

export interface KakaoAccount {
  // 프로필 관련 (모든 필드 optional - X 표시)
  profile_needs_agreement?: boolean;
  profile_nickname_needs_agreement?: boolean;
  profile_image_needs_agreement?: boolean;
  profile?: Profile;

  // 이름 관련 (모든 필드 optional - X 표시)
  name_needs_agreement?: boolean;
  name?: string;

  // 이메일 관련 (모든 필드 optional - X 표시)
  email_needs_agreement?: boolean;
  is_email_valid?: boolean;
  is_email_verified?: boolean;
  email?: string;

  // 연령대 관련 (모든 필드 optional - X 표시)
  age_range_needs_agreement?: boolean;
  age_range?: string;

  // 출생연도 관련 (모든 필드 optional - X 표시)
  birthyear_needs_agreement?: boolean;
  birthyear?: string;

  // 생일 관련 (모든 필드 optional - X 표시)
  birthday_needs_agreement?: boolean;
  birthday?: string;
  birthday_type?: "SOLAR" | "LUNAR";
  is_leap_month?: boolean;

  // 성별 관련 (모든 필드 optional - X 표시)
  gender_needs_agreement?: boolean;
  gender?: "female" | "male";

  // 전화번호 관련 (모든 필드 optional - X 표시)
  phone_number_needs_agreement?: boolean;
  phone_number?: string;

  // CI 관련 (모든 필드 optional - X 표시)
  ci_needs_agreement?: boolean;
  ci?: string;
  ci_authenticated_at?: string;
}
