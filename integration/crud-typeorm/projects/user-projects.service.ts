import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@lab3dvlp/crud-typeorm';

import { UserProject } from './user-project.entity';

@Injectable()
export class UserProjectsService extends TypeOrmCrudService<UserProject> {
  constructor(@InjectRepository(UserProject) repo) {
    super(repo);
  }
}
