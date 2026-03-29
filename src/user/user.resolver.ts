import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserPaginationResponse } from './models/user.model';
import { CreateUserDto, UpdateUserDto, UserFilter } from './dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserPaginationResponse)
  async users(
    @Args('filter') filter: UserFilter,
  ): Promise<UserPaginationResponse> {
    const users = await this.userService.findAll(filter);
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

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: number,
    @Args('dataupdate') dataUpdate: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userService.update(Number(id), dataUpdate);
    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: number): Promise<boolean> {
    const user = await this.userService.delete(Number(id));
    return user;
  }
}
