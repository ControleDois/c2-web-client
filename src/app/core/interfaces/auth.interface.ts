import { Config } from './config.interface';
import { Company } from './company.interface';
import { Token } from './token.interface';
import { User } from './user.interface';

export interface Auth {
  token: Token;
  user: User;
  config: Config;
  company: Company;
}
