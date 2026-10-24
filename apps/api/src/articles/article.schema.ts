import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; import { HydratedDocument } from 'mongoose';
export type ArticleDocument=HydratedDocument<Article>;
@Schema({timestamps:true}) export class Article { @Prop({required:true,index:true}) title!: string; @Prop({required:true,index:true}) category!: string; @Prop({required:true}) excerpt!: string; @Prop({required:true}) content!: string; @Prop() author?: string; @Prop() image?: string; @Prop({default:'draft',enum:['draft','published'],index:true}) status!: string; @Prop({type:[String],default:[]}) savedBy!: string[]; }
export const ArticleSchema=SchemaFactory.createForClass(Article);
