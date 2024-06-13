import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationStrategy } from '@app/authentication';
import { EUserAccountProvider, EUserRole, EUserStatus } from '@app/common';

describe('AuthenticationStrategy', () => {
  let authenticationStrategy: AuthenticationStrategy;
  let issuedToken;
  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
      ],
      providers: [AuthenticationStrategy],
    }).compile();

    authenticationStrategy = module.get<AuthenticationStrategy>(
      AuthenticationStrategy,
    );
  });

  it('issueToken', async () => {
    const result = await authenticationStrategy.issueToken({
      id: userId,
      name: 'name',
      displayName: 'displayName',
      phoneNumber: '01012345678',
      uid: 'test1234',
      provider: EUserAccountProvider.BASIC,
      status: EUserStatus.ACTIVE,
      role: EUserRole.STUDENT,
      createDate: new Date(),
      updateDate: new Date(),
    });
    // console.log(result);
    issuedToken = result;
    expect(result).toHaveProperty('key');
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('decodeToken', () => {
    const result = authenticationStrategy.decodeToken(issuedToken.accessToken);
    // console.log(result);
    expect(result.user.id).toEqual(userId);
  });
});
