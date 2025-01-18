import { FormEvent, useState } from 'react';
import './App.css';
import { z } from 'zod';

const parseFormData = <T,>(formEvent: FormEvent<HTMLFormElement>) => {
  const formData = new FormData(formEvent.currentTarget);
  const data = Object.fromEntries(formData.entries());

  return data as T;
};

const signUpSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해주세요.'),
    email: z.string().email('이메일 형식이 아닙니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자리 이상입니다.')
      .max(20, '비밀번호는 최대 20자리 이하입니다.'),
    rePassword: z.string(),
    birth: z.string(),
    gender: z.enum(['male', 'female'], {
      message: '성별을 선택해주세요.',
    }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['rePassword'],
  });

type SignUpData = z.infer<typeof signUpSchema>;
type SignUpErrorMessages = { [key in keyof SignUpData]?: string };

const App = () => {
  const [errorMessages, setErrorMessages] = useState<SignUpErrorMessages>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = parseFormData<SignUpData>(e);
    const { success, error } = signUpSchema.safeParse(formData);

    if (success) {
      setErrorMessages(undefined);
      console.log('성공', success);
      return;
    }

    setErrorMessages(() => {
      const newErrorMessages = {} as SignUpErrorMessages;

      error?.errors.forEach((error) => {
        newErrorMessages[error.path[0] as keyof SignUpErrorMessages] =
          error.message;
      });

      return newErrorMessages;
    });
  };

  return (
    <div>
      <h1>바닐라 폼 처리</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            aria-invalid={errorMessages?.name ? 'true' : 'false'}
            aria-describedby="nameError"
          />
          {errorMessages?.name && (
            <p aria-live="assertive" id="nameError">
              {errorMessages.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            type="text"
            id="email"
            name="email"
            aria-invalid={errorMessages?.email ? 'true' : 'false'}
            aria-describedby="emailError"
          />
          {errorMessages?.email && (
            <p aria-live="assertive" id="emailError">
              {errorMessages.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            aria-invalid={errorMessages?.password ? 'true' : 'false'}
            aria-describedby="passwordError"
          />
          {errorMessages?.password && (
            <p aria-live="assertive" id="passwordError">
              {errorMessages.password}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="rePassword">비밀번호 재확인</label>
          <input
            type="password"
            id="rePassword"
            name="rePassword"
            aria-invalid={errorMessages?.rePassword ? 'true' : 'false'}
            aria-describedby="rePasswordError"
          />
          {errorMessages?.rePassword && (
            <p aria-live="assertive" id="rePasswordError">
              {errorMessages.rePassword}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="birth">생년월일</label>
          <input type="date" id="birth" name="birth" />
        </div>
        <fieldset aria-describedby="genderError">
          <legend>성별</legend>
          <span>
            <label htmlFor="male">남자</label>
            <input type="radio" id="male" name="gender" value="male" />
          </span>
          <span>
            <label htmlFor="female">여자</label>
            <input type="radio" id="female" name="gender" value="female" />
          </span>
          {errorMessages?.gender && (
            <p id="genderError" aria-live="assertive">
              {errorMessages.gender}
            </p>
          )}
        </fieldset>
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
};

export default App;
