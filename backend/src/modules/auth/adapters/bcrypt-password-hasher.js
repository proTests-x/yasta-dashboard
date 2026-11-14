import bcrypt from "bcryptjs";

export const bcryptPasswordHasher = {
  hash(value) { return bcrypt.hash(value, 12); },
  compare(value, hash) { return bcrypt.compare(value, hash); }
};
