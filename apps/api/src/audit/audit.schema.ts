import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
@Schema({ timestamps: true }) export class AuditLog { @Prop({ required: true, index: true }) actorId!: Types.ObjectId; @Prop({ required: true }) action!: string; @Prop({ required: true, index: true }) entity!: string; @Prop() entityId?: string; @Prop({ type: Object }) metadata?: Record<string, unknown>; }
export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
