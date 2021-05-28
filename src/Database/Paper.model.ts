import { Schema, model } from 'mongoose';
import { IAuthor } from './Author.model';


const PaperType = [ 'Block', 'Article', 'White-Paper' ] as const;
export type IPaperType = typeof PaperType[number];
export interface IPaper {
  title:      string,
  body:       string,
  type:       IPaperType,
  author:     IAuthor,
  createdAt:  Date,
  updatedAt:  Date,
}

const PaperSchema = new Schema<IPaper>({
  title:  { type: String, minLength: 8, maxLength: 128, required: true, trim: true, indexed: true },
  body:   { type: String, minLength: 1, required: true, trim: true },
  type:   { type: String, enum: PaperType, required: true },
  author: { type: 'ObjectId', ref: 'Author', required: true },
}, {
  timestamps: true,
});

export const PaperModel = model('Paper', PaperSchema);