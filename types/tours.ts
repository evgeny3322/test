export interface Tour {
  title: string;
  video?: string;
  image?: string;
  semi_title?: string;
  description: string;
  buttons?: Blocks[];
  _id: string;
}
interface Blocks {
  value: string;
  _id: string;
}
