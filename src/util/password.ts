export const hashPassword = (password: string): string => {
  //todo: implement hash password
  return password;
};

export const verifyPassword = (
  password: string,
  hashPassword: string,
): boolean => {
  //todo: implement verify password
  return password === hashPassword;
};
