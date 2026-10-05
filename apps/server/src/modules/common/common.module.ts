import { Global, Module } from '@nestjs/common';

import { CommonService } from '@/modules/common/common.service';

@Global()
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
