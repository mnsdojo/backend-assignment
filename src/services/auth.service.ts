import { eq } from "drizzle-orm";
import { db } from "../db";
import { LoginInput, SignupInput } from "../validators/auth.validator";
import { users } from "../db/schema";
import {
  comparePassword,
  ConflictError,
  generateToken,
  hashPassword,
  UnauthorizedError,
} from "../utils";

export class AuthService {
  async signup(data: SignupInput) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashed = await hashPassword(data.password);
    const [newUser] = await db
      .insert(users)
      .values({
        email: data.email,
        password_hash: hashed,
        role: data.role,
      })
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });
    const token = await generateToken({
      userId: newUser.id,
      role: newUser.role,
    });
    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }
  async login(data: LoginInput) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const isPassValid = await comparePassword(
      data.password,
      user.password_hash,
    );
    if (!isPassValid) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const token = await generateToken({
      userId: user.id,
      role: user.role,
    });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getUserById(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      //Exlcuding pass here
      columns: {
        password_hash: false,
      },
    });
    return user;
  }
}

export const authService = new AuthService();
