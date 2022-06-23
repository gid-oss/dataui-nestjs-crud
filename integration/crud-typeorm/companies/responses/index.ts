import { SerializeOptions } from '@lab3dvlp/crud';
import { GetCompanyResponseDto } from './get-company-response.dto';

export const serialize: SerializeOptions = {
  get: GetCompanyResponseDto,
};
