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
