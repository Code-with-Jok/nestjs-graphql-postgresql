import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  username?: string | null;

  @Field()
  password: string;

  @Field(() => String, { nullable: true })
  phone?: string | null;
}

@ObjectType()
export class UserPaginationResponse {
  @Field(() => [User])
  data: User[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  itemsPerPage: number;
}
