import { RolsterAutocompleteElement } from '@rolster/components';
import { useFormControl, useInputControl } from '@rolster/react-forms';
import { useCallback } from 'react';
import {
  NavbarMenuOption,
  RlsAvatar,
  RlsBadge,
  RlsBallot,
  RlsButton,
  RlsButtonAction,
  RlsCard,
  RlsDatatable,
  RlsDatatableCell,
  RlsDatatableFloating,
  RlsDatatableRecord,
  RlsFieldAutocomplete,
  RlsFieldDate,
  RlsFieldDateRange,
  RlsFieldSelect,
  RlsFieldText,
  RlsIcon,
  RlsInputSearch,
  RlsLed,
  RlsNavbar,
  RlsNavbarMenu,
  RlsPoster,
  RlsTheme,
  useDesingSystemController,
  useRlsContext
} from '../index';

interface CourseItem {
  color: RlsTheme;
  icon: string;
  lessons: number;
  rate: number;
  title: string;
  type: string;
}

interface Person {
  color: string;
  documentNumber: string;
  name: string;
  offices: string;
  role: string;
  user: string;
}

const NAV_ITEMS: NavbarMenuOption[] = [
  { id: 'dashboard', icon: 'grid', label: 'Dashboard' },
  { id: 'my-courses', icon: 'book', label: 'My Courses' },
  { id: 'my-classes', icon: 'book-open', label: 'My Classes' },
  { id: 'messages', icon: 'message-circle', label: 'Messages' },
  { id: 'notifications', icon: 'bell', label: 'Notifications' },
  { id: 'calendars', icon: 'calendar', label: 'Calendars' },
  { id: 'community', icon: 'people', label: 'Community' },
  { id: 'settings', icon: 'settings', label: 'Settings' }
];

const NEW_COURSES: CourseItem[] = [
  {
    icon: 'shake',
    title: 'Content Writing',
    lessons: 12,
    rate: 4.8,
    type: 'Data Research',
    color: 'warning'
  },
  {
    icon: 'code',
    title: 'Usability Testing',
    lessons: 15,
    rate: 5.0,
    type: 'UI/UX Design',
    color: 'success'
  },
  {
    icon: 'camera',
    title: 'Photography',
    lessons: 8,
    rate: 4.6,
    type: 'Art and Design',
    color: 'amaizing'
  }
];

const PERSONS: Person[] = [
  {
    color: '#1780e0',
    documentNumber: '1.065.642.202',
    name: 'Daniel Andrés Castillo Pedroza',
    offices: '2 sucursal(es)',
    role: 'SUPERUSUARIO',
    user: 'daniel.castillo'
  },
  {
    color: '#63f2c3',
    documentNumber: '1.065.651.667',
    name: 'KATHERIN YULIETH BOLAÑO NARVAEZ',
    offices: '2 sucursal(es)',
    role: 'ADMINISTRADOR',
    user: 'kathebolano'
  }
];

class PersonListElement extends RolsterAutocompleteElement<Person> {
  public override get title(): string {
    return this.value.name;
  }

  public override get description(): string {
    return this.value.name;
  }

  public get subtitle(): string {
    return this.value.role;
  }
}

const PERSON_SUGGESTIONS = PERSONS.map(
  (person) => new PersonListElement(person)
);

export function DesignSystemFilled() {
  const { snackbar } = useRlsContext();

  const designSystem = useDesingSystemController();

  const searchControl = useInputControl('');
  const textControl = useInputControl('');
  const dateControl = useFormControl<Date>();
  const selectControl = useFormControl<Person>();
  const autocompleteControl = useFormControl<Person>();

  const showSnackbar = useCallback(() => {
    snackbar({
      icon: 'bell',
      rlsTheme: 'success',
      title: 'Operación exitosa',
      content: (
        <p>
          Los cambios realizados en el formulario fueron guardados correctamente
          y muy pronto estarán disponibles para todos los usuarios del sistema.
        </p>
      )
    });
  }, []);

  return (
    <div className="rls-app__body">
      <section className="rls-app__page">
        <RlsNavbar>
          <RlsNavbarMenu options={NAV_ITEMS} />
        </RlsNavbar>

        <div className="rls-app__page__body">
          <header className="rls-app__page__toolbar">
            <div className="dashboard__toolbar">
              <h6>Welcome back Daniel 👋</h6>

              <RlsButtonAction
                icon="person"
                type="flat"
                rlsTheme="success"
                disabled={true}
              />

              <RlsInputSearch
                placeholder="Search courses"
                formControl={searchControl}
                onSearch={() => {}}
              />
            </div>
          </header>

          <div className="rls-app__page__content">
            <div className="rls-flex-xs-grid-16 rls-flex-xs-grid-col-6">
              <div className="dashboard__section rls-flex-xs-col-4">
                <div className="dashboard__section__header">
                  <span className="rls-title-font">New Courses</span>
                  <a className="rls-label-font" href="#">
                    View All
                  </a>
                </div>

                <div className="rls-flex-xs-grid-16 rls-flex-xs-grid-col-6">
                  {NEW_COURSES.map((course) => (
                    <div key={course.title} className="rls-flex-xs-col-2">
                      <RlsCard className="dashboard__course">
                        <div className="dashboard__course__header">
                          <RlsAvatar rlsTheme={course.color}>
                            <RlsIcon value={course.icon} />
                          </RlsAvatar>

                          <RlsBallot
                            subtitle={
                              <span className="rls-caption-font">
                                {course.lessons} Lessons
                              </span>
                            }
                          >
                            <span className="rls-body-font-semibold">
                              {course.title}
                            </span>
                          </RlsBallot>
                        </div>

                        <div className="dashboard__course__meta">
                          <div className="dashboard__course__meta__item">
                            <span className="rls-smalltext-font-bold">
                              Rate
                            </span>

                            <div className="dashboard__course__meta__value">
                              <span className="rls-caption-font">
                                {course.rate.toFixed(1)}
                              </span>
                            </div>
                          </div>

                          <div className="dashboard__course__meta__item">
                            <span className="rls-smalltext-font-bold">
                              Type
                            </span>

                            <span className="rls-caption-font">
                              {course.type}
                            </span>
                          </div>
                        </div>
                      </RlsCard>
                    </div>
                  ))}
                </div>

                <RlsDatatable>
                  {PERSONS.map((person) => {
                    return (
                      <RlsDatatableRecord
                        key={person.documentNumber}
                        contained={true}
                      >
                        <RlsDatatableCell control={true}>
                          <RlsLed color={person.color} />
                        </RlsDatatableCell>
                        <RlsDatatableCell className="col-xs-20 rls-align-center">
                          <RlsPoster rlsTheme="info">
                            <b>{person.documentNumber}</b>
                          </RlsPoster>
                        </RlsDatatableCell>
                        <RlsDatatableCell className="col-xs-60">
                          <RlsBallot subtitle={<span>{person.role}</span>}>
                            <p>{person.name}</p>
                          </RlsBallot>
                        </RlsDatatableCell>
                        <RlsDatatableCell className="col-xs-20 rls-align-right">
                          <RlsBadge rlsTheme="amber">{person.user}</RlsBadge>
                        </RlsDatatableCell>

                        <RlsDatatableFloating rlsTheme="amber">
                          <RlsButtonAction icon="bell" />
                        </RlsDatatableFloating>
                      </RlsDatatableRecord>
                    );
                  })}
                </RlsDatatable>
              </div>

              <div className="dashboard__inputs rls-flex-xs-col-2">
                <RlsFieldDate formControl={dateControl} rlsTheme="success">
                  Fecha de cumpleaños
                </RlsFieldDate>

                <RlsFieldDateRange placeholder="Periodo del reporte">
                  Rango de periodo
                </RlsFieldDateRange>

                <RlsFieldText formControl={textControl}>
                  Nombre completo
                </RlsFieldText>

                <RlsFieldSelect
                  formControl={selectControl}
                  suggestions={PERSON_SUGGESTIONS}
                  placeholder="Seleccione una persona"
                >
                  Persona asignada
                </RlsFieldSelect>

                <RlsFieldAutocomplete
                  formControl={autocompleteControl}
                  suggestions={PERSON_SUGGESTIONS}
                  placeholder="Seleccione una persona"
                >
                  Persona asignada
                </RlsFieldAutocomplete>

                <RlsButton
                  type="raised"
                  rlsTheme="success"
                  prefixIcon="bell"
                  onClick={showSnackbar}
                >
                  Mostrar snackbar
                </RlsButton>

                <RlsButton
                  type="stroked"
                  rlsTheme="info"
                  prefixIcon="shake"
                  onClick={designSystem.toggle}
                >
                  Cambiar temática
                </RlsButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
