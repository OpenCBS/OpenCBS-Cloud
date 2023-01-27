export class Event {
  title: string;
  description: string;
  start: string;
  end: string;
  notify: any;
  allDay = true;
  participants: Object[];
  createdBy: any;
  id: number;
}
