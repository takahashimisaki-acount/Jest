//変更できる方
import axios from 'axios';
import { getMembershipDays, isAdmin, getUserById } from './index';

jest.mock('axios');
const mockApi = axios as jest.Mocked<typeof axios>;

const today = new Date();
const creationDate = new Date(today);
creationDate.setFullYear(today.getFullYear() - 1);

const expectedData = {
  id: "1",
  email: 'john@mail.com',
  password: 'changeme',
  name: 'Jhon',
  role: 'customer',
  avatar: 'https://i.imgur.com/LDOO4Qs.jpg',
  creationAt: creationDate.toISOString(),
  updatedAt: today.toISOString(),
};

describe('getUserById', () => {
  test('取得に成功した場合はexpectedDataと同じデータが取得されること', async () => {
    mockApi.get.mockResolvedValueOnce({ status: 200, data: expectedData } as any);

    const result = await getUserById('1');
    expect(result).toEqual(expectedData);
    expect(mockApi.get).toHaveBeenCalledWith(
      'https://api.escuelajs.co/api/v1/users/1'
    );
  });

  test('取得に失敗した場合はエラーメッセージが返ってくること', async () => {
    mockApi.get.mockResolvedValueOnce({ status: 500 });

    await expect(getUserById('1')).rejects.toThrow('データの取得に失敗しました');
  });
});

describe('isAdmin', () => {
  test('roleがadminの場合はtrueが返ってくること', async () => {
    const adminData = { ...expectedData, role: 'admin' };
    mockApi.get.mockResolvedValueOnce({ status: 200, data: adminData });

    const result = await isAdmin('1');
    expect(result).toBe(true);
  });

  test('roleがadminでない場合はfalseが返ってくること', async () => {
    const customerData = { ...expectedData, role: 'customer' };
    mockApi.get.mockResolvedValueOnce({ status: 200, data: customerData });

    const result = await isAdmin('1');
    expect(result).toBe(false);
  });
});

describe('getMembershipDays', () => {
  test('メンバーシップの経過日数が取得できること', async () => {
  mockApi.get.mockResolvedValueOnce({ status: 200, data: expectedData });

    const days = await getMembershipDays('1');
    expect(days).toBeGreaterThanOrEqual(364);
    expect(days).toBeLessThanOrEqual(366);  
  });
});


