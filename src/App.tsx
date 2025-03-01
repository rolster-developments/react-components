import { RolsterAutocompleteElement } from '@rolster/components';
import {
  RlsAmount,
  RlsButton,
  RlsDatatable,
  RlsDatatableCell,
  RlsDatatableData,
  RlsDatatableHeader,
  RlsDatatableRecord,
  RlsDatatableTitle,
  RlsDatatableTotals,
  RlsFieldDate,
  RlsFieldDateRange,
  RlsFieldMoney,
  RlsFieldNumber,
  RlsFieldSelect,
  RlsFieldText,
  RlsLabelSwitch,
  RlsPagination,
  RlsPoster,
  RlsTabularText,
  RlsTheme
} from '../dist/esm';
import {
  formArrayGroup,
  formArrayList,
  inputArrayControl,
  ReactArrayControls,
  ReactArrayList,
  ReactControls,
  ReactFormArray,
  ReactInputArrayControl,
  useFormArray,
  useFormControl,
  useFormGroup,
  useInputControl
} from '@rolster/react-forms';
import { required } from '@rolster/validators/helpers';
import { useEffect, useState } from 'react';

const names = [
  'Daniel Castillo Pedroza',
  'Nelson Ceballos',
  'Katherin Bolaño Narvaez',
  'Adrian Castillo Pedroza',
  'Fabian Castillo Pedroza',
  'Yessika Bolaño Narvaez',
  'Andres Bolaño Narvaez',
  'Milton Castillo Martinez',
  'Yomaira Pedroza Payares',
  'Cristiano Ronaldo Aveiro',
  'Lionel Messi Cuccitini'
];

interface ClassControls extends ReactArrayControls {
  name: ReactInputArrayControl<string>;
  note: ReactInputArrayControl<number>;
}

interface PersonControls extends ReactArrayControls {
  label: ReactInputArrayControl<string>;
  name: ReactInputArrayControl<string>;
  price: ReactInputArrayControl<number>;
  classes: ReactArrayList<ClassControls>;
}

interface SchoolControls extends ReactControls {
  persons: ReactFormArray<PersonControls>;
}

function App() {
  const dateControl = useFormControl<Date | undefined>(new Date());
  const disabledControl = useFormControl(false);
  const rlsControl = useFormControl<RlsTheme>(undefined);
  const textControl = useInputControl<string>('Daniel', [required]);
  const numberControl = useInputControl(12);
  const moneyControl = useInputControl(512486);

  const formGroup = useFormGroup<SchoolControls>({
    controls: {
      persons: useFormArray([])
    }
  });

  const [themes, setThemes] = useState<RolsterAutocompleteElement<RlsTheme>[]>([
    new RolsterAutocompleteElement<RlsTheme>('standard'),
    new RolsterAutocompleteElement<RlsTheme>('success'),
    new RolsterAutocompleteElement<RlsTheme>('info'),
    new RolsterAutocompleteElement<RlsTheme>('warning'),
    new RolsterAutocompleteElement<RlsTheme>('danger'),
    new RolsterAutocompleteElement<RlsTheme>('amaizing'),
    new RolsterAutocompleteElement<RlsTheme>('smartness'),
    new RolsterAutocompleteElement<RlsTheme>('obsidian')
  ]);

  const [namesPag, setNamesPag] = useState(names);

  useEffect(() => {}, []);

  function onPicker() {
    setThemes([
      new RolsterAutocompleteElement<RlsTheme>('standard'),
      new RolsterAutocompleteElement<RlsTheme>('success'),
      new RolsterAutocompleteElement<RlsTheme>('info'),
      new RolsterAutocompleteElement<RlsTheme>('warning'),
      new RolsterAutocompleteElement<RlsTheme>('danger')
    ]);
  }

  function onClick(): void {
    rlsControl.setValue('obsidian');

    const classes = formArrayList<ClassControls>((phone) => ({
      name: inputArrayControl(phone.name),
      note: inputArrayControl(phone.note)
    }));

    const r = formArrayGroup<PersonControls>({
      label: inputArrayControl(''),
      name: inputArrayControl(''),
      price: inputArrayControl(0),
      classes
    });

    formGroup.controls.persons.push(r);
  }

  function onButton3() {
    setNamesPag([
      'Daniel Castillo Pedroza',
      'Nelson Ceballos',
      'Katherin Bolaño Narvaez',
      'Adrian Castillo Pedroza',
      'Fabian Castillo Pedroza'
    ]);

    formGroup.controls.persons.groups[0]?.controls.name.setValue('Daniel');
  }

  return (
    <div className="app">
      <RlsFieldSelect
        identifier="daniel-1024"
        suggestions={themes}
        formControl={rlsControl}
        automatic={true}
      >
        Tematica de la Aplicacion
      </RlsFieldSelect>
    </div>
  );
}

export default App;
