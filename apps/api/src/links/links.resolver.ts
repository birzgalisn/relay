import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateLinkInput } from './inputs/create-link.input';
import { UpdateLinkInput } from './inputs/update-link.input';
import { Link } from './models/link.model';
import { CreateLinkUseCase } from './use-cases/create-link.use-case';
import { DeleteLinkUseCase } from './use-cases/delete-link.use-case';
import { GetLinkUseCase } from './use-cases/get-link.use-case';
import { ListLinksUseCase } from './use-cases/list-links.use-case';
import { UpdateLinkUseCase } from './use-cases/update-link.use-case';

@Resolver(() => Link)
export class LinksResolver {
  constructor(
    private readonly create: CreateLinkUseCase,
    private readonly list: ListLinksUseCase,
    private readonly get: GetLinkUseCase,
    private readonly update: UpdateLinkUseCase,
    private readonly remove: DeleteLinkUseCase,
  ) {}

  @Query(() => [Link])
  links(): Promise<Link[]> {
    return this.list.execute();
  }

  @Query(() => Link)
  link(@Args('id', { type: () => ID }) id: string): Promise<Link> {
    return this.get.execute(id);
  }

  @Mutation(() => Link)
  createLink(@Args('input') input: CreateLinkInput): Promise<Link> {
    return this.create.execute(input);
  }

  @Mutation(() => Link)
  updateLink(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateLinkInput,
  ): Promise<Link> {
    return this.update.execute(id, input);
  }

  @Mutation(() => Boolean)
  async deleteLink(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.remove.execute(id);

    return true;
  }
}
