import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Journal { @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId; @Prop({ required: true, trim: true }) title!: string; @Prop({ required: true, maxlength: 20000 }) body!: string; @Prop() prompt?: string; @Prop({ index: true }) moodTag?: string; @Prop() emotion?: string; @Prop({ default: false, index: true }) archived!: boolean; }
export const JournalSchema = SchemaFactory.createForClass(Journal); JournalSchema.index({ userId: 1, createdAt: -1 });

@Schema({ timestamps: true })
export class Goal { @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId; @Prop({ required: true }) title!: string; @Prop({ required: true }) category!: string; @Prop({ required: true, min: 1, max: 365 }) target!: number; @Prop({ required: true }) unit!: string; @Prop({ default: 0, min: 0 }) current!: number; @Prop({ default: 0, min: 0, max: 100 }) progress!: number; @Prop({ type: [{ text: String, done: Boolean }], default: [] }) milestones!: { text: string; done: boolean }[]; @Prop({ default: 'active', enum: ['active', 'completed', 'archived'], index: true }) status!: string; }
export const GoalSchema = SchemaFactory.createForClass(Goal); GoalSchema.index({ userId: 1, status: 1 });

@Schema({ timestamps: true })
export class CbtEntry { @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId; @Prop({ required: true, maxlength: 5000 }) trigger!: string; @Prop({ required: true, maxlength: 10000 }) automaticThought!: string; @Prop({ required: true, min: 0, max: 100 }) initialAnxiety!: number; @Prop({ type: [String], default: [] }) cognitiveTraps!: string[]; @Prop({ maxlength: 10000 }) supportingFacts?: string; @Prop({ maxlength: 10000 }) counterEvidence?: string; @Prop({ required: true, maxlength: 10000 }) groundedStatement!: string; @Prop({ min: 0, max: 100 }) postAnxiety?: number; @Prop({ default: false }) sharedWithTherapist!: boolean; }
export const CbtEntrySchema = SchemaFactory.createForClass(CbtEntry); CbtEntrySchema.index({ userId: 1, createdAt: -1 });

@Schema({ timestamps: true })
export class ExerciseProgress { @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId; @Prop({ required: true }) exerciseKey!: string; @Prop({ default: 0, min: 0, max: 100 }) progress!: number; @Prop({ default: false }) completed!: boolean; @Prop() lastActivityAt?: Date; @Prop({ unique: true }) uniqueKey!: string; }
export const ExerciseProgressSchema = SchemaFactory.createForClass(ExerciseProgress); ExerciseProgressSchema.index({ userId: 1, exerciseKey: 1 }, { unique: true });

@Schema({ timestamps: true })
export class Notification { @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId; @Prop({ required: true }) type!: string; @Prop({ required: true }) title!: string; @Prop({ required: true, maxlength: 1000 }) body!: string; @Prop() link?: string; @Prop({ default: false, index: true }) unread!: boolean; }
export const NotificationSchema = SchemaFactory.createForClass(Notification); NotificationSchema.index({ userId: 1, unread: 1, createdAt: -1 });
