import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CommonModule,
  DOMAINS,
  generateTypeormModuleOptions,
} from '@app/common';
import { Notice } from '@app/common/entities/notice';
import { NoticeService } from './notice.service';
import { ENoticeCategory, ENoticeStatus } from '@app/common/enums/notice';
import { ENoticeErrorMessage } from '@app/common/enums/notice/notice-error-message.enum';

describe('NoticeService', () => {
  let noticeService: NoticeService;
  let notice: Notice;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/local.env',
        }),
        TypeOrmModule.forRootAsync({
          name: DOMAINS.Notice,
          useFactory: (configService: ConfigService) =>
            generateTypeormModuleOptions(configService, DOMAINS.Notice),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Notice], DOMAINS.Notice),
        CommonModule,
      ],
      providers: [NoticeService],
    }).compile();

    noticeService = module.get<NoticeService>(NoticeService);
  });

  it('createNotice', async () => {
    const result = await noticeService.createNotice({
      title: 'test',
      contents: 'this is test content',
      category: ENoticeCategory.NOTIFICATION,
      status: ENoticeStatus.ACTIVE,
    });
    notice = result;
    expect(result.title).toBe('test');
  });

  it('listNotice', async () => {
    const result = await noticeService.listNotice({});

    expect(result.list.length).toBeGreaterThan(0);
  });

  it('getNotice', async () => {
    const result = await noticeService.getNoticeById(notice.id);

    expect(result.id).toBe(result.id);
  });

  it('getActiveNotice', async () => {
    const result = await noticeService.createNotice({
      title: 'Inactive notice test',
      contents: 'this is an Inactive test content',
      category: ENoticeCategory.EVENT,
      status: ENoticeStatus.INACTIVE,
    });
    try {
      await noticeService.getActiveNoticeById(result.id);
    } catch (e) {
      expect(e.message).toBe(ENoticeErrorMessage.NOTICE_NOT_FOUND);
    }
    try {
      await noticeService.getActiveNoticeById(notice.id);
    } catch (e) {
      expect(notice.title).toBe(ENoticeStatus.ACTIVE);
    }
  });

  it('updateNotice', async () => {
    const result = await noticeService.updateNoticeById(notice.id, {
      title: 'updatedNotice',
      contents: 'this will be deleted',
      category: ENoticeCategory.EVENT,
      status: ENoticeStatus.INACTIVE,
    });
    expect(result.title).toBe('updatedNotice');
  });

  it('deleteNotice', async () => {
    const deletedNotice = await noticeService.deleteNoticeById(notice.id);
    try {
      await noticeService.getNoticeById(deletedNotice.id);
    } catch (e) {
      expect(e.message).toBe(ENoticeErrorMessage.NOTICE_NOT_FOUND);
    }
  });
});
