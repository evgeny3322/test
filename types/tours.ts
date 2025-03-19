export interface Tour {
  id: number;
  name: string;
  description: string;
  featured: number;
  short_description: string;
  duration: string;
  min_cost: number | null;
  max_cost: number | null;
  max_participants: number;
  area: Area;
  segments: Segment[];
  media: any[];
}
export interface ToursApiResponse {
  data: Tour[];
  links?: object;
  meta?: object;
}
export interface TourApiResponse {
  data: Tour;
}
export interface Area {
  id: number;
  name: string;
  description: string;
}

export interface Segment {
  id: number;
  name: string;
  description: string;
  duration: string;
  type: {
    id: number;
    name: string;
    description: string;
    mandatory: number;
  };
  order: number;
  addons: Addon[];
}

export interface Addon {
  id: number;
  name: string;
  description: string;
  internal_description: string;
  max_participants: number;
  price: number[];
  cost_type: 'group_diff' | 'group_fix';
  resource: Resource;
  code: string;
  area: Area;
  duration: string;
  period: string;
  media: any[];
  segmentType?: string;
}

export interface Resource {
  id: number;
  name: string;
  description: string;
}

export interface TourFilters {
  area_id?: number;
  max_participants?: number;
  duration?: string;
  min_cost?: number;
  max_cost?: number;
}
