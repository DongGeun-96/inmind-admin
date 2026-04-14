const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': '아이디 또는 비밀번호가 올바르지 않아요.',
  'Email not confirmed': '이메일 인증이 완료되지 않았어요.',
  'Email rate limit exceeded': '너무 많은 요청이 발생했어요. 잠시 후 다시 시도해주세요.',
  'Auth session missing!': '로그인이 필요해요.',
};

export function toKoreanError(message: string): string {
  if (ERROR_MAP[message]) return ERROR_MAP[message];

  for (const [key, value] of Object.entries(ERROR_MAP)) {
    if (message.includes(key)) return value;
  }

  if (message.includes('rate limit') || message.includes('too many')) {
    return '너무 많은 요청이 발생했어요. 잠시 후 다시 시도해주세요.';
  }

  return '오류가 발생했어요. 잠시 후 다시 시도해주세요.';
}
