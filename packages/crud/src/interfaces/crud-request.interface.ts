import { ParsedRequestParams } from '@lab3dvlp/crud-request';

import { CrudRequestOptions } from '../interfaces';

export interface CrudRequest {
  parsed: ParsedRequestParams;
  options: CrudRequestOptions;
}
