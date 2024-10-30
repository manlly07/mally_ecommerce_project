import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { KeysModule } from '../keys/keys.module';
import { UserRepository } from 'src/repositories/user.repository';
import { PrismaService } from 'src/common/connection/prisma/prisma.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      }
    ]),
    KeysModule,
    
  ],
  providers: [UsersService, UserRepository, PrismaService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
