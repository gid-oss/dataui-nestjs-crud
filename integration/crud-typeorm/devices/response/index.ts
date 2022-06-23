import { SerializeOptions } from '@lab3dvlp/crud';
import { DeleteDeviceResponseDto } from './delete-device-response.dto';

export const serialize: SerializeOptions = {
  delete: DeleteDeviceResponseDto,
};
