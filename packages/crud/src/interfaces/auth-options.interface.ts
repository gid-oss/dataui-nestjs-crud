import { SCondition } from '@lab3dvlp/crud-request';
import { ObjectLiteral } from '@lab3dvlp/crud-util';

export interface AuthGlobalOptions {
  property?: string;
}

export interface AuthOptions {
  property?: string;
  filter?: (req: any) => SCondition | void;
  or?: (req: any) => SCondition | void;
  persist?: (req: any) => ObjectLiteral;
}
