import { RolsterListElement } from '@rolster/components';
import { useFormControl, useInputControl } from '@rolster/react-forms';
import {
  RlsAccordion,
  RlsBallot,
  RlsButton,
  RlsCard,
  RlsChip,
  RlsFieldSelect,
  RlsFieldText,
  RlsInputSearch,
  RlsLabelCheckBox,
  RlsSlider
} from '../../index';
import {
  Job,
  JOB_TYPES,
  JOBS,
  PERKS,
  SEARCH_COUNTRIES,
  SEARCH_MODES,
  SEARCH_SALARIES
} from '../data/jobs';
import { jobSalaryLabel, searchSummary } from '../helpers/search';

import './SearchPage.scss';

const SALARY_OPTIONS = SEARCH_SALARIES.map(
  (salary) => new RolsterListElement(salary)
);
const MODE_OPTIONS = SEARCH_MODES.map((mode) => new RolsterListElement(mode));
const COUNTRY_OPTIONS = SEARCH_COUNTRIES.map(
  (country) => new RolsterListElement(country)
);

const SUMMARY = searchSummary(['$58,000+', 'Part-time', 'United Kingdom']);

interface JobTypeOptionProps {
  checked: boolean;
  label: string;
}

function JobTypeOption({ checked, label }: JobTypeOptionProps) {
  const control = useInputControl<boolean>(checked);

  return <RlsLabelCheckBox formControl={control}>{label}</RlsLabelCheckBox>;
}

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  const { bullets, city, company, mode, posted, rating, tags, title } = job;

  return (
    <RlsCard className="search-page__job">
      <div className="search-page__job__header">
        <RlsBallot
          initials={company.charAt(0)}
          subtitle={
            <span className="rls-caption-font">
              {company} in {city} ★ {rating}
            </span>
          }
        >
          <span className="rls-body-font-semibold">{title}</span>
        </RlsBallot>

        <div className="search-page__job__salary">
          <span className="rls-body-font-semibold">{jobSalaryLabel(job)}</span>

          <span className="rls-caption-font">{mode}</span>
        </div>
      </div>

      <ul className="search-page__job__bullets">
        {bullets.map((bullet) => (
          <li key={bullet} className="rls-body-font">
            {bullet}
          </li>
        ))}
      </ul>

      <div className="search-page__job__footer">
        <div className="search-page__tags">
          {tags.map((tag) => (
            <RlsChip key={tag} rlsTheme="warning" selected={true}>
              {tag}
            </RlsChip>
          ))}

          <span className="rls-caption-font">{posted}</span>
        </div>

        <RlsButton type="ghost">See more</RlsButton>
      </div>
    </RlsCard>
  );
}

export function SearchPage() {
  const queryControl = useInputControl<string>('Head manager');
  const emailControl = useInputControl<string>('');
  const salaryControl = useFormControl<string>('$58,000+');
  const modeControl = useFormControl<string>('Part-time');
  const countryControl = useFormControl<string>('UK');
  const rangeControl = useFormControl<number>(48);

  return (
    <section className="search-page">
      <aside className="search-page__filters">
        <span className="rls-subtitle-font">Job Searcher 🔎</span>

        <RlsAccordion title="Location" bordered={true} />

        <RlsAccordion title="Job Type" bordered={true} opened={true}>
          <div className="search-page__filters__group">
            {JOB_TYPES.map((type) => (
              <JobTypeOption
                key={type}
                label={type}
                checked={type === 'Part-Time'}
              />
            ))}
          </div>
        </RlsAccordion>

        <RlsAccordion title="Experience Label" bordered={true} />

        <RlsAccordion title="Salary Range" bordered={true} opened={true}>
          <div className="search-page__filters__group">
            <RlsSlider formControl={rangeControl} minValue={0} maxValue={100} />

            <div className="search-page__filters__range">
              <span className="rls-caption-font">$1,340</span>
              <span className="rls-caption-font">$4,800</span>
            </div>
          </div>
        </RlsAccordion>

        <RlsAccordion title="Tags" bordered={true} />

        <RlsAccordion title="Headcount" bordered={true} />
      </aside>

      <div className="search-page__results">
        <div className="search-page__bar">
          <RlsInputSearch formControl={queryControl} placeholder="Search" />

          <RlsFieldSelect
            formControl={salaryControl}
            suggestions={SALARY_OPTIONS}
            placeholder="Salary"
          />

          <RlsFieldSelect
            formControl={modeControl}
            suggestions={MODE_OPTIONS}
            placeholder="Mode"
          />

          <RlsFieldSelect
            formControl={countryControl}
            suggestions={COUNTRY_OPTIONS}
            placeholder="Country"
          />

          <RlsButton type="raised" rlsTheme="primary">
            Search
          </RlsButton>
        </div>

        <div className="search-page__summary">
          <RlsBallot
            subtitle={<span className="rls-caption-font">{SUMMARY}</span>}
          >
            <span className="rls-subtitle-font">
              Search result: {JOBS.length}
            </span>
          </RlsBallot>

          <div className="search-page__summary__actions">
            <RlsButton type="ghost" prefixIcon="heart">
              Favorites
            </RlsButton>

            <RlsButton type="ghost" prefixIcon="swap">
              Highest Salary
            </RlsButton>
          </div>
        </div>

        {JOBS.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <aside className="search-page__aside">
        <RlsCard className="search-page__alert">
          <span className="rls-body-font-semibold">
            Be the first to see new jobs
          </span>

          <p className="rls-caption-font">
            Activate the job alert now and never miss new jobs.
          </p>

          <RlsFieldText
            formControl={emailControl}
            placeholder="username@domain.com"
          />

          <RlsButton type="raised" rlsTheme="primary">
            Activate
          </RlsButton>
        </RlsCard>

        <div className="search-page__tags">
          {PERKS.map((perk) => (
            <RlsChip key={perk}>{perk}</RlsChip>
          ))}
        </div>
      </aside>
    </section>
  );
}
