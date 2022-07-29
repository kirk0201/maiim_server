import {
  ForbiddenException,
  NotFoundException,
  Injectable,
} from "@nestjs/common";
import {
  JoinUserDto,
  LoginDto,
  UpdateUserDto,
  FindEmailDto,
  FindPwDto,
} from "./users.dto";
import {
  UserRepository,
  UserFindOneOptions,
  UserFindAllOptions,
} from "./user.repository";
import { User } from "./user.entity";
import { UsersJoinValidator } from "./users.join.validator";
import * as bcrypt from "bcryptjs";
import { signToken } from "src/utils/utils.jwt";
import * as nodemailer from "nodemailer";

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly UsersJoinValidator: UsersJoinValidator
  ) {}

  public async joinUser(userData: JoinUserDto) {
    const { email, password, name, nickname, phone, address, birth, gender } =
      userData;

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

  public async login(login: LoginDto) {
    // res: Response
    const { email, password } = login;

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

  public async update(updateUser: UpdateUserDto, id: number) {
    let { nickname } = updateUser;
    const regexAlpaAndNumeric = /^(?=.*[0-9])(?=.*[a-z])/;

    if (updateUser.password) {
      if (!regexAlpaAndNumeric.test(updateUser.password)) {
        throw new ForbiddenException(
          "비밀번호에 영문과 숫자를 포함시켜 주세요."
        );
      }
      const salt = await bcrypt.genSalt(10);
      updateUser.password = await bcrypt.hash(updateUser.password, salt);
    }

    if (nickname) {
      if (nickname.length > 10)
        throw new ForbiddenException("닉네임이 10자 초과합니다.");

      const findNickNameUser = await this.userRepository.findOne({ nickname });
      if (findNickNameUser)
        throw new ForbiddenException("닉네임이 이미 존재합니다.");
    }

    await this.userRepository.update(id, updateUser);
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

  public async findEmail(userData: FindEmailDto) {
    const { name, phone } = userData;

    const userEmail = await this.userRepository.findOne({ name, phone });

    if (!userEmail) throw new ForbiddenException("일치하는 회원이 없습니다.");
    console.log(userEmail)
    const { email } = userEmail;
    console.log(email)
    return { email };
  }

  public async findPw(userData: FindPwDto) {
    const { name, email } = userData;

    let userCheck = await this.userRepository.findOne({ name, email });

    if (!userCheck) throw new ForbiddenException("일치하는 회원이 없습니다.");

    // 임시로 사용할 랜덤 비밀번호 생성
    let randomString = Math.random().toString(36).slice(2);
    console.log("randomString입니다 = ", randomString);

    // 임시비밀번호도 솔트생성후 해쉬화 해서 db에 저장한다
    bcrypt.genSalt(10, (err, salt) => {
      // 솔트생성 실패시 오류 메세지 전송
      if (err) throw new NotFoundException("솔트생성에 실패했습니다.");
      console.log("salt입니다 = ", salt);
      // 솔트생성 성공시 해쉬화 진행
      bcrypt.hash(randomString, salt, async (err, hash) => {
        if (err) throw new NotFoundException("비밀번호 해쉬화에 실패했습니다.");
        console.log("hash입니다 = ", hash);

        randomString = hash;
        const randomPw = { password: randomString };
        // 발급받은 비밀번호를 사용하기 위해 유저정보에 비밀번호를 발급받은 해쉬화한 임시비밀번호로 바꿔준다
        await this.userRepository.update(userCheck.id, randomPw);
      });
    });

    // 임시 비밀번호를 이메일로 전송 시킨다
    // 이메일 발송 구현
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wonjumaiim@gmail.com",
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: "wonjumaiim@gmail.com",
      to: email,
      subject: "임시 비밀번호 안내",
      html:
        "<h1 >Maiim에서 임시 비밀번호를 알려드립니다.</h1> <h2> 비밀번호 : " +
        randomString +
        "</h2>" +
        '<h3 style="color: crimson;">임시 비밀번호로 로그인 하신 후, 마이페이지 에서 반드시 비밀번호를 수정해 주세요.</h3>',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return { success: true };
  }
}
