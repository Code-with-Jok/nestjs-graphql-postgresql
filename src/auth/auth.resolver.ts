import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/user/models/user.model';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { LoginResponse } from './models/auth.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async register(@Args('userData') userData: RegisterDto): Promise<User> {
    return await this.authService.register(userData);
  }

  @Mutation(() => LoginResponse)
  async login(@Args('userData') userData: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(userData);
  }
}
