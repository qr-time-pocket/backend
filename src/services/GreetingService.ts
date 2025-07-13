import { injectable } from 'tsyringe';

@injectable()
export class GreetingService {
  sayHello(name: string) {
    return `Hello, ${name}!`;
  }
}