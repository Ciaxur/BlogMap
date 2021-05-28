import { Schema, model } from 'mongoose';

export interface IAuthor {
  name: string,
}

const AuthorSchema = new Schema<IAuthor>({
  name: { type: String, minLength: 4, maxLength: 64, required: true, trim: true, indexed: true },
});

export const AuthorModel = model('Author', AuthorSchema);