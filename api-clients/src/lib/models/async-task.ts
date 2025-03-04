export interface IAsyncTask {
  id: number;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
}