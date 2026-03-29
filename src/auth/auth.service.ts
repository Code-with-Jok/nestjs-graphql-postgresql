import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User } from 'src/generated/prisma/client';
import { hash, compare } from 'bcrypt';
import { LoginResponse } from './models/auth.model';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(userData: RegisterDto): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (user) {
      throw new HttpException(
        {
          message: 'This email has been used!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPass = await hash(userData.password, 10);

    const result = await this.prismaService.user.create({
      data: {
        ...userData,
        password: hashPass,
      },
    });
    return result;
  }

  async login(userData: LoginDto): Promise<LoginResponse> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          message: 'User not found!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMatch = await compare(userData.password, user.password);

    if (!isMatch) {
      throw new HttpException(
        {
          message: 'Invalid password!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = {
      id: user.id,
      name: user.username,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: '60s',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
