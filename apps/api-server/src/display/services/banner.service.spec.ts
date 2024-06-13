import { Test, TestingModule } from '@nestjs/testing';
import { BannerService, SlotService } from '../services';
import {
  Banner,
  Slot,
  CommonModule,
  DOMAINS,
  generateTypeormModuleOptions,
} from '@app/common';
import { EBannerErrorMessage } from '@app/common/enums/banner/banner-error-message.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EBannerPlatform,
  EBannerStatus,
  ESlotStatus,
} from '@app/common/enums/banner';
import { faker } from '@faker-js/faker';

describe('BannerService', () => {
  let bannerService: BannerService;
  let slotService: SlotService;
  let createdSlot: Slot;
  let createdBanner: Banner;
  let bannerData;
  let slotData;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'env/test.env',
        }),
        TypeOrmModule.forRootAsync({
          name: DOMAINS.Display,
          useFactory: (configService: ConfigService) =>
            generateTypeormModuleOptions(configService, DOMAINS.Display),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Slot, Banner], DOMAINS.Display),
        CommonModule,
      ],
      providers: [BannerService, SlotService],
    }).compile();

    bannerService = module.get<BannerService>(BannerService);
    slotService = module.get<SlotService>(SlotService);
  });

  beforeAll(async () => {
    slotData = {
      title: faker.lorem.words(),
      status: EBannerStatus.ACTIVE,
      writerUserId: 1,
    };
    createdSlot = await slotService.createSlot(slotData);
  });
  afterAll(async () => {
    await bannerService.deleteBannerById(createdBanner.id);
    await slotService.deleteSlotById(createdSlot.id);
  });

  describe('createBanner', () => {
    it('배너 생성 ', async () => {
      bannerData = {
        slotId: 0,
        sequence: 1,
        url: 'https://example.com',
        title: faker.lorem.words(),
        description: 'An example display',
        platform: EBannerPlatform.WEB,
        imageUrl: 'https://example.com/image.jpg',
        status: EBannerStatus.ACTIVE,
        writerUserId: 1,
      };

      createdBanner = await bannerService.createBanner({
        ...bannerData,
        slotId: createdSlot.id,
      });
      expect(createdBanner.title).toBe(bannerData.title);
    });
  });

  describe('getBannerById', () => {
    it('특정 배너 가져오기', async () => {
      const result = await bannerService.getBannerById(createdBanner.id);
      expect(result.title).toBe(createdBanner.title);
    });
    it('존재하지 않는 배너 슬롯 조회시 오류 발생', async () => {
      try {
        await bannerService.getBannerById(-1);
      } catch (e) {
        expect(e.message).toBe(EBannerErrorMessage.BANNER_NOT_FOUND);
      }
    });
  });

  describe('listBanner', () => {
    it('배너 목록 가져오기', async () => {
      const result = await bannerService.listBanner({
        slotId: createdBanner.slotId,
      });
      expect(result.list[0].slotId).toBe(createdBanner.slotId);
    });
  });

  describe('updateBanner', () => {
    const updateBannerData = {
      sequence: 2,
      url: 'https://exampleUpdate.com',
      title: faker.lorem.words(),
      description: 'An updated example display',
      platform: EBannerPlatform.MOBILE,
      imageUrl: 'https://example.com/Updatedimage.jpg',
      status: EBannerStatus.INACTIVE,
      writerUserId: 2,
    };
    it('배너 내용 업데이트', async () => {
      const updatedBanner = await bannerService.updateBannerById(
        createdBanner.id,
        updateBannerData,
      );
      expect(updatedBanner.title).toEqual(updateBannerData.title);
    });
  });

  describe('deleteBannerById', () => {
    let deleteBannerSlot: Slot;
    let deleteBanner: Banner;

    beforeAll(async () => {
      deleteBannerSlot = await slotService.createSlot({
        title: faker.lorem.words(),
        status: ESlotStatus.ACTIVE,
        writerUserId: 1,
      });
      deleteBanner = await bannerService.createBanner({
        slotId: deleteBannerSlot.id,
        sequence: 1,
        url: 'https://example.com',
        title: faker.lorem.words(),
        description: 'An example display',
        platform: EBannerPlatform.WEB,
        imageUrl: 'https://example.com/image.jpg',
        status: EBannerStatus.ACTIVE,
        writerUserId: 1,
      });
    });

    afterAll(async () => {
      await slotService.deleteSlotById(deleteBannerSlot.id);
    });

    it('배너 삭제', async () => {
      await bannerService.deleteBannerById(deleteBanner.id);
      try {
        await bannerService.getBannerById(deleteBanner.id);
      } catch (e) {
        expect(e.message).toBe(EBannerErrorMessage.BANNER_NOT_FOUND);
      }
    });
  });
});
