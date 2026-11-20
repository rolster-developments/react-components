const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+\.[^\s@.]+$/;

const EMAIL_MESSAGE =
  'Please enter an email address in the format username@domain.com';

export interface ProfileError {
  id: string;
  message: string;
}

export function profileEmailError(
  value?: string | null
): ProfileError | undefined {
  return EMAIL_PATTERN.test(value ?? '')
    ? undefined
    : { id: 'email', message: EMAIL_MESSAGE };
}
