import axios from 'axios';

type UserData = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
  creationAt: string;
  updatedAt: string;
};

const USER_API = 'https://api.escuelajs.co/api/v1/users/';
export async function getUserById(id: string): Promise<UserData> {
  const response = await axios.get(`${USER_API}${id}`);
  if (response.status !== 200) {
    throw new Error('データの取得に失敗しました');
  }
  return response.data;
}

export const isAdmin = async (id: string): Promise<boolean> => {
  const user = await getUserById(id);
  return user.role === 'admin';
};

export const getMembershipDays = async (id: string): Promise<number> => {
  const user = await getUserById(id);
  const creationDate = new Date(user.creationAt);
  const now = new Date();
  const result = Math.floor(
    (now.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return result;
};
