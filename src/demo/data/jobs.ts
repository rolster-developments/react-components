export type JobPeriod = 'year' | 'month';

export interface Job {
  bullets: string[];
  city: string;
  company: string;
  icon: string;
  id: string;
  mode: string;
  period: JobPeriod;
  posted: string;
  rating: number;
  salaryFrom: number;
  tags: string[];
  title: string;
  salaryTo?: number;
}

export const JOBS: Job[] = [
  {
    id: 'business-manager',
    title: 'Business Manager',
    company: 'Instakilogram',
    city: 'Glasgow',
    icon: 'camera',
    rating: 4.9,
    salaryFrom: 109100,
    salaryTo: 160000,
    period: 'year',
    mode: 'Remote',
    bullets: [
      "Bachelor's degree in a related field.",
      'The ideal candidate will be an exceptional writer and editor who exhibits sound business judgment, a proven ability to.'
    ],
    tags: ['Boosted'],
    posted: 'August 29, 2021 · 1:56 PM'
  },
  {
    id: 'associate-service-manager-nikola',
    title: 'Associate Service Manager',
    company: 'Nikola',
    city: 'London',
    icon: 'car',
    rating: 4.4,
    salaryFrom: 99200,
    period: 'year',
    mode: 'Part-time',
    bullets: [
      'Responsible for driving excellent results in customer service and operational efficiency in our store.'
    ],
    tags: ['Responsive Employer', 'Urgently Hiring'],
    posted: 'August 27, 2021 · 9:10 AM'
  },
  {
    id: 'associate-service-manager-netflixa',
    title: 'Associate Service Manager',
    company: 'Netflixa',
    city: 'Lancaster',
    icon: 'film',
    rating: 4.6,
    salaryFrom: 5887,
    salaryTo: 8478,
    period: 'month',
    mode: 'Part-time',
    bullets: [
      'Responsible for preparing and monitoring the annual budget for the department, including capital, equity, CIP and relevant enterprise, special district or grant.'
    ],
    tags: ['Great Choice'],
    posted: 'September 14, 2021 · 5:03 AM'
  }
];

export const JOB_TYPES = [
  'Permanent position',
  'Part-Time',
  'Remote',
  'Student',
  'Contract'
];

export const PERKS = [
  'Pets allowed',
  'Free meal',
  'Near me',
  'Lunch trip',
  'Shower',
  'Near the Subway',
  'Gym',
  'Extra day off',
  'Free Courses'
];

export const SEARCH_MODES = ['Part-time', 'Full-time', 'Internship'];

export const SEARCH_SALARIES = ['$58,000+', '$80,000+', '$120,000+'];

export const SEARCH_COUNTRIES = ['UK', 'Spain', 'Colombia'];
