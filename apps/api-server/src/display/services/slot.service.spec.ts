import { Test, TestingModule } from '@nestjs/testing';
import { SlotService } from '../services';
import {
  Banner,
  Slot,
  CommonModule,
  DOMAINS,
  generateTypeormModuleOptions,
} from '@app/common';
import { ESlotErrorMessage } from '@app/common/enums/banner/banner-error-message.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EBannerStatus, ESlotStatus } from '@app/common/enums/banner';
import { faker } from '@faker-js/faker';

describe('BannerService', () => {
  let slotService: SlotService;
  let createdSlot: Slot;
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
      providers: [SlotService],
    }).compile();

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
    await slotService.deleteSlotById(createdSlot.id);
  });

  describe('createSlot', () => {
    it('슬롯 생성 ', async () => {
      slotData = {
        title: faker.lorem.words(),
        status: EBannerStatus.ACTIVE,
        writerUserId: 1,
      };
      createdSlot = await slotService.createSlot(slotData);
      expect(createdSlot.title).toBe(slotData.title);
    });
  });

  describe('getBannerById', () => {
    it('특정 배너 가져오기', async () => {
      const result = await slotService.getSlotById(createdSlot.id);
      expect(result.id).toBe(createdSlot.id);
    });
    it('존재하지 않는 배너 슬롯 조회시 오류 발생', async () => {
      try {
        await slotService.getSlotById(-1);
      } catch (e) {
        expect(e.message).toBe(ESlotErrorMessage.SLOT_NOT_FOUND);
      }
    });
  });

  describe('listSlot', () => {
    it('listSlot', async () => {
      const result = await slotService.listSlot({
        title: slotData.title,
      });

      expect(result).toHaveProperty('list');
      expect(result).toHaveProperty('pagination');
    });
  });

  describe('getSlotByTitle', () => {
    it('특정 배너 가져오기', async () => {
      const result = await slotService.getSlotByTitle(createdSlot.title);
      expect(result.title).toBe(createdSlot.title);
    });
    it('존재하지 않는 배너슬롯 조회시 오류 발생', async () => {
      try {
        await slotService.getSlotByTitle('not found');
      } catch (e) {
        expect(e.message).toBe(ESlotErrorMessage.SLOT_NOT_FOUND);
      }
    });
  });

  describe('updateSlot', () => {
    const updateSlotData = {
      title: faker.lorem.words(),
      status: ESlotStatus.INACTIVE,
      writerUserId: 2,
    };

    it('배너 내용 업데이트', async () => {
      const updateSlot = await slotService.updateSlotById(
        createdSlot.id,
        updateSlotData,
      );
      expect(updateSlot.title).toEqual(updateSlotData.title);
    });
  });

  describe('listSlot', () => {
    it('슬롯 목록 조회', async () => {
      const result = await slotService.listSlot({
        title: slotData.title,
      });
      expect(result).toHaveProperty('list');
      expect(result).toHaveProperty('pagination');
    });
  });

  describe('deleteSlotById', () => {
    let deleteSlot: Slot;

    beforeAll(async () => {
      deleteSlot = await slotService.createSlot({
        title: faker.lorem.words(),
        status: ESlotStatus.ACTIVE,
        writerUserId: 1,
      });
    });
    afterAll(async () => {
      await slotService.deleteSlotById(deleteSlot.id);
    });

    it('슬롯 삭제', async () => {
      await slotService.deleteSlotById(deleteSlot.id);
      try {
        await slotService.getSlotById(deleteSlot.id);
      } catch (e) {
        expect(e.message).toBe(ESlotErrorMessage.SLOT_NOT_FOUND);
      }
    });
  });
});
