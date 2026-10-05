import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Decorator to inject the loaders into the context
 *
 * @example
 * ```typescript
 * @Query(() => User)
 * @UseGuards(JwtGuard)
 * async userById(@Param('id') userId: string, @Loaders() loaders: DataLoaders) {
 *   const _user = await loaders.userByIdLoader.load(userId);
 *   return _user;
 * }
 * ```
 */
export const Loaders = createParamDecorator((_, context) => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext().loaders;
});
