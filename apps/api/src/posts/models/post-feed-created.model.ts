import { ObjectType } from '@nestjs/graphql';

import { PostModel } from './post.model';

@ObjectType('PostFeedCreated')
export class PostFeedCreatedModel extends PostModel {}
