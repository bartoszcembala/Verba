export type SignupInput = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
