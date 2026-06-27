import { ObjectType } from '@nestjs/graphql';

import { Post } from './post.model';

@ObjectType('PostCreated')
export class PostCreated extends Post {}
