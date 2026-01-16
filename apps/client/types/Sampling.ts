import { Locomotive } from "./locomotive";

export interface Sampling {
  id?: number;
  locomotive_id: string;
  start_date: string;
  examination_frequency: string;
  locomotive?: Locomotive;
  sampleExamine?: SampleExamine;
}
export interface SampleExamine {
  id?: number;
  notes: string;
  file?: File;
}
