import type { PostCreated } from '../models/post-created.model';
import type { PostRemoved } from '../models/post-removed.model';

export type PostEvent = PostCreated | PostRemoved;
