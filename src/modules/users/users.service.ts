import { ForbiddenException, Injectable } from "@nestjs/common";
import { joinUserDto, loginDto } from "./users.dto";
import {
  UserRepository,
  UserFindOneOptions,
  UserFindAllOptions,
} from "./user.repository";
import { User } from "./user.entity";
import { UsersJoinValidator } from "./users.join.validator";
import * as bcrypt from "bcryptjs";
import { signToken } from "src/utils/utils.jwt";

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly UsersJoinValidator: UsersJoinValidator
  ) {}

  public async joinUser(joinUserDto: joinUserDto) {
    const { email, password, name, nickname, phone, address, birth, gender } =
      joinUserDto;

    const user = new User({
      email,
      password,
      name,
      nickname,
      phone,
      address,
      birth,
      gender,
    });

    await this.UsersJoinValidator.validate(user);

    // 패스워드 암호화 진행
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await this.userRepository.save(user);
  }

  public async login(loginDto: loginDto) {
    // res: Response
    const { email, password } = loginDto;

    const findUser = await this.userRepository.findOne({ email });

    if (!findUser) throw new ForbiddenException("존재하지 않는 이메일입니다.");

    // 암호화된 패스워드 검사
    if (!(await bcrypt.compare(password, findUser.password)))
      throw new ForbiddenException("비밀번호가 일치하지 않습니다.");

    const token = await signToken({ id: findUser.id });

    return { token, findUser };
  }

  public async userInfo(id: number) {
    const userInfo = await this.userRepository.findOne({ id });

    return { userInfo };
  }

  public async update(user: any, id: number) {
    let { nickname } = user;
    const regexAlpaAndNumeric = /^(?=.*[0-9])(?=.*[a-z])/;

    if (user.password) {
      if (!regexAlpaAndNumeric.test(user.password)) {
        throw new ForbiddenException(
          "비밀번호에 영문과 숫자를 포함시켜 주세요."
        );
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    if (nickname) {
      if (nickname.length > 10)
        throw new ForbiddenException("닉네임이 10자 초과합니다.");

      const findNickNameUser = await this.userRepository.findOne({ nickname });
      if (findNickNameUser)
        throw new ForbiddenException("닉네임이 이미 존재합니다.");
    }

    await this.userRepository.update(id, user);
  }

  public async delete(id: number) {
    await this.userRepository.delete(id);
  }

  public async findAll(options?: UserFindAllOptions) {
    return this.userRepository.findAll(options);
  }

  public async findOne(options?: UserFindOneOptions) {
    return this.userRepository.findOne(options);
  }
}
