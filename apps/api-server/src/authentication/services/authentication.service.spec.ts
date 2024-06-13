import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CommonModule, EUserRole } from '@app/common';
import { AuthenticationStrategy } from '@app/authentication';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
        CommonModule,
      ],
      providers: [AuthenticationService, AuthenticationStrategy],
    }).compile();

    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
  });

  it('issueToken', async () => {
    const result = await authenticationService.issueToken({
      role: EUserRole.STUDENT,
    });
    // console.log(result);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });
});
