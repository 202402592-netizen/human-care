import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; import { HydratedDocument } from 'mongoose';
@Schema({timestamps:true}) export class PlatformSetting { @Prop({required:true,unique:true}) key!: string; @Prop({type:Object,required:true}) value!: Record<string,unknown>; }
@Schema({timestamps:true}) export class Feedback { @Prop({required:true,index:true}) status!: string; @Prop({required:true}) message!: string; @Prop() email?: string; @Prop() userId?: string; }
export const PlatformSettingSchema=SchemaFactory.createForClass(PlatformSetting); export const FeedbackSchema=SchemaFactory.createForClass(Feedback);
