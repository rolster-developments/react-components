export type EmployeeStatus = 'free' | 'busy' | 'working' | 'vacation';

export interface Employee {
  email: string;
  id: string;
  name: string;
  role: string;
  status: EmployeeStatus;
}

export type BudgetKind = 'up' | 'down' | 'love';

export interface Budget {
  active: boolean;
  id: string;
  label: string;
  trend: BudgetKind;
  value: number;
}

export const EMPLOYEES: Employee[] = [
  {
    id: 'roman-bellic',
    name: 'Roman Bellic',
    email: 'purchaseuikits@setproduct.com',
    status: 'free',
    role: 'Art Director'
  },
  {
    id: 'sarah-smith',
    name: 'Sarah Smith',
    email: 'sk8er@palacecrew.net',
    status: 'busy',
    role: 'UX Writer'
  },
  {
    id: 'eleanor-pena',
    name: 'Eleanor Pena',
    email: 'lookatmyhat@mail.me',
    status: 'working',
    role: 'UX Engineer'
  },
  {
    id: 'rachel-richards',
    name: 'Rachel Richards',
    email: 'rondondon@nfs.org',
    status: 'free',
    role: 'UI Master'
  },
  {
    id: 'arlene-mccoy',
    name: 'Arlene McCoy',
    email: 'arlenemccoyindagame@heyhey.com',
    status: 'working',
    role: 'Product Manager'
  },
  {
    id: 'courtney-henry',
    name: 'Courtney Henry',
    email: 'henry96@mail.com',
    status: 'vacation',
    role: 'HR Assistant'
  },
  {
    id: 'guy-hawkins',
    name: 'Guy Hawkins',
    email: 'thatguy@fromalaska.us',
    status: 'busy',
    role: 'The Boss'
  },
  {
    id: 'devon-lane',
    name: 'Devon Lane',
    email: 'devon_dfg@eyefind.info',
    status: 'free',
    role: 'Full-Stack Developer'
  },
  {
    id: 'eleanor-junior',
    name: 'Eleanor P. Junior',
    email: 'epj2022@mail.com',
    status: 'working',
    role: 'UX Engineer'
  },
  {
    id: 'maria-bruno',
    name: 'Maria Bruno',
    email: 'bruno987@cast.co',
    status: 'busy',
    role: 'Manager'
  }
];

export const BUDGETS: Budget[] = [
  {
    id: 'total',
    label: 'Total Budget',
    value: 74994,
    trend: 'up',
    active: false
  },
  {
    id: 'monthly',
    label: 'Monthly Budget',
    value: 12315.89,
    trend: 'down',
    active: true
  },
  {
    id: 'weekly',
    label: 'Weekly Budget',
    value: 3476.15,
    trend: 'up',
    active: false
  },
  {
    id: 'today',
    label: 'Today Budget',
    value: 777,
    trend: 'love',
    active: false
  }
];
