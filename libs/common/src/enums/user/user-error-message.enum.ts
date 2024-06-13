export enum EUserErrorMessage {
  USER_NOT_FOUND = '존재하지 않는 유저 입니다.',
  USER_CONFLICT = '이미 존재하는 유저 입니다.',
  USER_NOT_FOUND_MATCHING = '일치하는 회원 정보가 없습니다.',
}

export enum EUserAccountErrorMessage {
  USER_ACCOUNT_NOT_FOUND = '존재하지 않는 유저 계정 입니다.',
  USER_ACCOUNT_NOT_FOUND_SIGN_IN = '아이디(로그인 전용 아이디) 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.',
  USER_ACCOUNT_CONFLICT = '이미 존재하는 유저 계정 입니다.',
  USER_ADMIN_ACCOUNT_CONFLICT = '이미 존재하는 어드민 계정 입니다.',
  USER_BAD_REQUEST = '유저 계정 정보가 올바르지 않습니다.',
}

export enum EUserCertifyErrorMessage {
  USER_CERTIFY_UNKNOWN = '인증되지 않은 유저 입니다.',
}

export enum EUserAuthErrorMessage {
  USER_AUTH_BAD_REQUEST_PASSWORD = '아이디(로그인 전용 아이디) 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.',
  USER_AUTH_BAD_REQUEST_CODE = '코드가 올바르지 않습니다.',
  USER_AUTH_BAD_REQUEST_ACCESS_TOKEN = '액세스 토큰이 유효하지 않습니다.',
  USER_FORBIDDEN_ADMIN = '관리자만 접근할 수 있는 페이지 입니다.',
}

export enum EConditionErrorMessage {
  CONDITION_NOT_FOUND = '존재하지 않는 약관 입니다.',
  CONDITION_CONFLICT_TYPE = '이미 존재하는 약관 타입 입니다.',
}
