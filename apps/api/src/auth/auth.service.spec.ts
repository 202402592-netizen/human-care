import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  it('rejects invalid credentials', async () => {
    const users = { findOne: jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue(null) }) } as any;
    const service = new AuthService(users, { sign: jest.fn() } as any);
    await expect(service.login({ email: 'nobody@example.com', password: 'bad' })).rejects.toThrow('Invalid credentials');
  });

  it('hashes passwords during registration and returns an access token', async () => {
    const created = { _id: 'user-1', name: 'Maya', email: 'maya@example.com', role: 'patient', status: 'active', profile: {} };
    const users = { exists: jest.fn().mockResolvedValue(false), create: jest.fn().mockResolvedValue(created) } as any;
    const jwt = { sign: jest.fn().mockReturnValue('access-token') } as any;
    const service = new AuthService(users, jwt);
    const result = await service.register({ name: 'Maya', email: 'maya@example.com', password: 'A secure password' });
    expect(result.accessToken).toBe('access-token');
    expect(users.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'maya@example.com', role: 'patient', passwordHash: expect.any(String) }));
    expect(await bcrypt.compare('A secure password', users.create.mock.calls[0][0].passwordHash)).toBe(true);
  });
});
