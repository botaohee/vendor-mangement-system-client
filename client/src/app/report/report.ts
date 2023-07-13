import {ReportItem} from './report-item';

export interface Report {
  id: number;
  vendorid: number;
  amount: number;
  items: ReportItem[];
  podate: Date;
}
