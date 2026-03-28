import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/user.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await this.userService.findAll();

    return users;
  }

  @Query(() => User)
  async user(@Args('id') id: number): Promise<User> {
    const user = await this.userService.findOne(Number(id));
    return user;
  }

  @Mutation(() => User)
  async createUser(@Args('userData') userData: CreateUserDto): Promise<User> {
    const user = await this.userService.create(userData);
    return user;
  }
}
