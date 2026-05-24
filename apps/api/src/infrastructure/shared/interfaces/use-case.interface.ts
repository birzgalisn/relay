export interface UseCase<Input = void, Output = void> {
  execute(input: Input): Output | Promise<Output>;
}
