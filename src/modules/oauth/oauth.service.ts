import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/user.entity';

@Injectable()
export class OauthService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}
  
  public async googleLogin(req) {
    const { email, password, name } = req.user

    if (!req.user) {
      return 'No user from google'
    } else {
      // db에 해당 유저가 있는지 확인
      const findUser = await this.userRepository.findOne({ email })
      
      // 최초 구글 로그인시 정보를 db에 저장 
      if (!findUser) {
        const nickname = name
        const phone = "휴대폰 번호를 입력해주세요"
        const address = "주소를 입력해주세요"
        const birth = "생년월일을 입력해주세요"
        const gender = 1

        const user = new User({ email, password, name, nickname, phone, address, birth, gender })
        await this.userRepository.save(user)
      }
      return {
      message: 'User information from google',
      user: req.user
      }
    }
  }
}
