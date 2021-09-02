import { IsEmail, IsNotEmpty } from 'class-validator'

export class joinUserDto {
    @IsEmail({}, { message: "이메일 형식으로 입력해주세요" } )
    email: string

    @IsNotEmpty({ message: "패스워드를 입력해주세요" })
    password: string

    @IsNotEmpty({ message: "이름을 입력해주세요" })
    name: string

    @IsNotEmpty({ message: "닉네임을 입력해주세요" })
    nickname: string

    @IsNotEmpty({ message: "생년월일을 입력해주세요" })
    birth: string

    @IsNotEmpty({ message: "주소를 입력해주세요" })
    address: string

    @IsNotEmpty({ message: "핸드폰 번호를 입력해주세요" })
    phone: string

    @IsNotEmpty({ message: "성별을 입력해주세요" })
    gender: number
}

export class loginDto {
    @IsEmail({}, { message: "이메일 형식으로 입력해주세요" } )
    email: string

    @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
    password: string
}