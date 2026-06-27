import { ObjectType } from '@nestjs/graphql';

import { Post } from './post.model';

@ObjectType('PostRemoved')
export class PostRemoved extends Post {}
