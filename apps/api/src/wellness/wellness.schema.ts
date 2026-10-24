import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; import { HydratedDocument, Types } from 'mongoose';
@Schema({timestamps:true}) export class WellnessLog { @Prop({type:Types.ObjectId,ref:'User',required:true,index:true}) userId!: Types.ObjectId; @Prop({required:true,index:true}) date!: Date; @Prop({required:true}) mood!: string; @Prop({min:1,max:10}) moodScore?: number; @Prop({min:0,max:24}) sleepHours?: number; @Prop() anxietyLevel?: string; @Prop({maxlength:2000}) note?: string; }
export const WellnessLogSchema=SchemaFactory.createForClass(WellnessLog);
