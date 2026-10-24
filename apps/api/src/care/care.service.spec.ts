import { CareService } from './care.service';

describe('CareService ownership and progress rules', () => {
  const user = { sub: 'patient-1' };
  it('does not return another patient journal', async () => {
    const journals = { findOne: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) }) };
    const service = new CareService(journals as any, {} as any, {} as any, {} as any, {} as any);
    await expect(service.journal(user, 'journal-2')).rejects.toThrow('Record not found');
    expect(journals.findOne).toHaveBeenCalledWith({ _id: 'journal-2', userId: 'patient-1', archived: false });
  });

  it('updates only the owned goal and derives completion from milestones', async () => {
    const goal = { userId: 'patient-1', milestones: [{ text: 'one', done: true }, { text: 'two', done: false }], current: 0, progress: 0, status: 'active', save: jest.fn().mockResolvedValue({ progress: 100, status: 'completed' }) };
    const goals = { findOne: jest.fn().mockResolvedValue(goal) };
    const service = new CareService({} as any, goals as any, {} as any, {} as any, {} as any);
    await service.progressGoal(user, 'goal-1', { milestoneIndex: 1, done: true });
    expect(goal.current).toBe(2); expect(goal.progress).toBe(100); expect(goal.status).toBe('completed'); expect(goal.save).toHaveBeenCalled();
  });
});
