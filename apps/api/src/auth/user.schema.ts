import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../common/roles.decorator';
export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, unique: true, lowercase: true, index: true }) email!: string;
  @Prop({ required: true, select: false }) passwordHash!: string;
  @Prop({ required: true, enum: ['patient', 'therapist', 'admin'], index: true }) role!: Role;
  @Prop({ default: 'active', enum: ['active', 'suspended', 'pending'], index: true }) status!: string;
  @Prop() phone?: string;
  @Prop() avatar?: string;
  @Prop({ type: Object, default: {} }) profile!: Record<string, unknown>;
  @Prop() refreshTokenHash?: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
