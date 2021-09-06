import { ForbiddenException, Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

export const regexAlpaAndNumeric = /^(?=.*[0-9])(?=.*[a-z])/;

@Injectable()
export class UsersJoinValidator {
  constructor(private readonly userRepository: UserRepository) {}

  public async validate(user: User) {
    const { email, nickname, password } = user;

    const findEmailUser = await this.userRepository.findOne({ email });
    if (findEmailUser)
      throw new ForbiddenException("이메일이 이미 존재합니다.");

    if (nickname.length > 10)
      throw new ForbiddenException("닉네임이 10자 초과합니다.");

    const findNickNameUser = await this.userRepository.findOne({ nickname });
    if (findNickNameUser)
      throw new ForbiddenException("닉네임이 이미 존재합니다.");

    // 비밀번호 영문숫자
    if (!this.isIncludeAlphaAndNumeric(password))
      throw new ForbiddenException("비밀번호에 영문과 숫자를 포함시켜 주세요.");
  }

  private isIncludeAlphaAndNumeric(password: string) {
    return regexAlpaAndNumeric.test(password);
  }
}
