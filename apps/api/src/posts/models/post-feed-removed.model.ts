import { ObjectType } from '@nestjs/graphql';

import { PostModel } from './post.model';

@ObjectType('PostFeedRemoved')
export class PostFeedRemovedModel extends PostModel {}
