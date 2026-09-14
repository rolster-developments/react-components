# Rolster React Components

Package containing UI components for React Project.

## Installation

```
npm i @rolster/react-components
```

## Configuration

You must install the `@rolster/types` package to define package data types, which are configured by adding them to the `files` property of the `tsconfig.json` file.

```json
{
  "files": ["node_modules/@rolster/types/index.d.ts"]
}
```

`react` and `react-dom` are supplied by the host application. The `package.json` declares `react-dom` as a dependency, and `@types/react` and `@types/react-dom` as development dependencies; `react` is not declared in any of them, so the application is the one that installs it.

### Stylesheets

The components render classes only, they do not ship styles. Those classes are defined in `@rolster/styles-foundations`, which must be installed and imported by the application.

```
npm i @rolster/styles-foundations
```

The package exposes the following entry points, each one available as Sass (`@use`) and as compiled CSS:

| Entry point                                          | Content                                                               |
| ---------------------------------------------------- | --------------------------------------------------------------------- |
| `@rolster/styles-foundations`                        | Foundations and utilities: custom properties, typography, grid, fonts |
| `@rolster/styles-foundations/components`             | Structure of every component, without a design system                 |
| `@rolster/styles-foundations/design-system-bordered` | Bordered design system                                                |
| `@rolster/styles-foundations/design-system-filled`   | Filled design system                                                  |
| `@rolster/styles-foundations/design-system-gradient` | Gradient design system                                                |

```scss
@use '@rolster/styles-foundations';
@use '@rolster/styles-foundations/components';
@use '@rolster/styles-foundations/design-system-filled';
@use '@rolster/styles-foundations/design-system-bordered';
```

Every design system is nested inside its own wrapper class (`.rls-design-system-bordered`, `.rls-design-system-filled`, `.rls-design-system-gradient`), so its rules only reach the elements below an element carrying that class. `setDesignSystem` writes that class on `document.body` and removes the remaining ones, which allows importing more than one design system and switching between them at runtime.

### Application

`RlsApplication` must wrap the application. It renders its `children` inside the `rls-app__body` element and mounts the snackbar, the confirmation dialog and the notification stack, so all of them are available anywhere in the tree. It publishes a context, read with `useRlsContext`, that exposes:

| Member                | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `confirmation`        | Opens the confirmation dialog and resolves with a `ConfirmationResult` |
| `notify`              | Pushes a notification on the stack                                     |
| `snackbar`            | Shows a snackbar                                                       |
| `setIsMobile`         | Marks the application body as mobile                                   |
| `setNavbarInApp`      | Declares that a navbar is mounted, so the snackbar respects it         |
| `setNavbarIsCondense` | Declares that the navbar is condensed                                  |

Reading the context outside the wrapper throws an error.

```tsx
import { RlsApplication, setDesignSystem } from '@rolster/react-components';
import { createRoot } from 'react-dom/client';
import { Dashboard } from './Dashboard';

import './styles.scss';

setDesignSystem('filled');

createRoot(document.getElementById('root')!).render(
  <RlsApplication>
    <Dashboard />
  </RlsApplication>
);
```

### Form controls

Field components are driven by `@rolster/react-forms`: the `formControl` prop takes a `ReactControl` created with `useInputControl` or `useFormControl`, and the field renders the error of the control through `RlsMessageFormError`. Those messages are translated with `@rolster/i18n` and can be extended with `setErrorsI18n`.

Components that display a list of options (`RlsFieldSelect`, `RlsFieldList`, `RlsFieldAutocomplete` and the `RlsChooser*` family) receive their `suggestions` as elements of `@rolster/components`, usually instances of `RolsterListElement` or `RolsterAutocompleteElement`, or of a subclass that overrides `title`, `description` and `compareTo`.

## Features

### Atoms

| Component             | Description                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `RlsAmount`           | Currency value split into integer and decimal tabular text, with an optional symbol       |
| `RlsAreaText`         | `textarea` that grows with its content and syncs value, focus and disabled with a control |
| `RlsAvatar`           | Container for an image, initials or icon, with contrasted, rounded and skeleton variants  |
| `RlsBadge`            | Inline badge, contrasted when requested                                                   |
| `RlsBreadcrumb`       | Row of labels, each one actionable when it declares `onClick`                             |
| `RlsButton`           | Button of type `ghost`, `flat` or `raised`, with icons and a spinner while `requesting`   |
| `RlsButtonAction`     | Icon button with optional badge and tooltip                                               |
| `RlsButtonIcon`       | Icon button without decoration, with skeleton state                                       |
| `RlsButtonOption`     | Icon button that behaves as one option of a single selection over a control               |
| `RlsCheckBox`         | Checkbox mark driven by the `checked` prop                                                |
| `RlsCheckBoxControl`  | `RlsCheckBox` bound to a `boolean` control                                                |
| `RlsHoverSwap`        | Renders `children` and swaps it for `content` while the pointer is over it                |
| `RlsIcon`             | Renders the glyph `rls-icon-{value}`, with skeleton state                                 |
| `RlsImage`            | `img` that shows a skeleton until the source finishes loading                             |
| `RlsInput`            | Base `input` that syncs value, focus and disabled with a control                          |
| `RlsInputCounter`     | Number input with decrement and increment buttons, clamped by `min`, `max` and `step`     |
| `RlsInputDecimal`     | Number input for `BigDecimal` values that overlays the formatted amount                   |
| `RlsInputMoney`       | Number input that overlays the value formatted as currency                                |
| `RlsInputNumber`      | Number input that overlays the current value                                              |
| `RlsInputPassword`    | Input whose type switches between `password` and `text`                                   |
| `RlsInputPercentage`  | Number input that overlays the value followed by `%`                                      |
| `RlsInputSearch`      | Text input with a search action button                                                    |
| `RlsInputText`        | Text input that overlays the current value                                                |
| `RlsLabel`            | Text label                                                                                |
| `RlsLed`              | Indicator whose background is set from a hexadecimal color                                |
| `RlsMessageIcon`      | Icon followed by a truncated message                                                      |
| `RlsPoster`           | Highlighted block of content, contrasted when requested                                   |
| `RlsProgressBar`      | Progress bar by `percentage` or indeterminate                                             |
| `RlsProgressCircular` | Circular progress indicator drawn in SVG                                                  |
| `RlsRadioButton`      | Radio mark driven by the `checked` prop                                                   |
| `RlsSkeleton`         | Placeholder block while content is loading                                                |
| `RlsSkeletonText`     | Renders `children`, or a skeleton while `active`                                          |
| `RlsSpinner`          | Loading spinner drawn in SVG                                                              |
| `RlsSwitch`           | Switch driven by the `checked` prop, with capsule variant                                 |
| `RlsSwitchControl`    | `RlsSwitch` bound to a `boolean` control                                                  |
| `RlsTabularText`      | Renders each character in its own span, so digits keep a fixed width                      |

```tsx
import { RlsButton, RlsIcon, RlsPoster } from '@rolster/react-components';

function Header({ requesting, onSave }: HeaderProps) {
  return (
    <div className="header">
      <RlsPoster rlsTheme="info">
        <RlsIcon value="person" />
      </RlsPoster>

      <RlsButton
        type="raised"
        rlsTheme="success"
        prefixIcon="checkmark"
        requesting={requesting}
        onClick={onSave}
      >
        Save
      </RlsButton>
    </div>
  );
}
```

### Molecules

| Component                 | Description                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| `RlsAccordion`            | Collapsible section with title and indicator, animated on the height of its content      |
| `RlsAlert`                | Message block with optional icon and bordered variant                                    |
| `RlsBallot`               | Avatar, title and subtitle row, with skeleton state                                      |
| `RlsBody`                 | Body container of an application page                                                    |
| `RlsButtonProgress`       | Action button surrounded by a circular progress while `progressing`                      |
| `RlsButtonStepper`        | Pair of buttons that emit a down and an up action                                        |
| `RlsButtonToggle`         | Action button with a second button that opens the list of `options`                      |
| `RlsContent`              | Content container of an application page                                                 |
| `RlsFieldArea`            | Labelled field over `RlsAreaText` with its error message                                 |
| `RlsFieldDecimal`         | Labelled field over `RlsInputDecimal` with its error message                             |
| `RlsFieldFile`            | Labelled field that opens a file selector and shows the name of the chosen file          |
| `RlsFieldListSuggestions` | Suggestion list rendered in a portal, with optional search input, action and empty state |
| `RlsFieldMoney`           | Labelled field over `RlsInputMoney` with its error message                               |
| `RlsFieldNumber`          | Labelled field over `RlsInputNumber` with its error message                              |
| `RlsFieldPassword`        | Labelled field over `RlsInputPassword` with a button that reveals the value              |
| `RlsFieldPercentage`      | Labelled field over `RlsInputPercentage` with its error message                          |
| `RlsFieldReadonly`        | Labelled field that displays a value in a read only input                                |
| `RlsFieldText`            | Labelled field over `RlsInputText` with its error message                                |
| `RlsLabelCheckBox`        | Checkbox and text that toggle a `boolean` control                                        |
| `RlsLabelRadioButton`     | Radio and text that assign their `value` to a control                                    |
| `RlsLabelSwitch`          | Switch and text that toggle a `boolean` control                                          |
| `RlsMessageEmpty`         | Empty state with icon, emoji or image, title and content                                 |
| `RlsMessageFormError`     | Renders the translated error of a control while it is wrong                              |
| `RlsNavbar`               | Navigation bar of an application page, with backdrop                                     |
| `RlsNavbarMenu`           | List of navigation options with icon and label                                           |
| `RlsPagination`           | Paginator over a collection that emits a `PaginationEvent` on every page                 |
| `RlsPickerDay`            | Grid of the days of a month, restricted by `minDate` and `maxDate`                       |
| `RlsPickerDayRange`       | Grid of the days of a month that highlights the selected range                           |
| `RlsPickerMonth`          | Grid of the months of a year                                                             |
| `RlsPickerSelectorTitle`  | Header with month and year, and buttons for previous and next                            |
| `RlsPickerYear`           | Grid of years with navigation by decade                                                  |
| `RlsSlider`               | Value selector over a track, operated with pointer and keyboard                          |
| `RlsTabs`                 | Tab bar that assigns the value of the selected tab to a control                          |
| `RlsToolbar`              | Title, subtitle and list of actions                                                      |

```tsx
import { RlsFieldText, RlsLabelSwitch } from '@rolster/react-components';
import { useInputControl } from '@rolster/react-forms';
import { email, required } from '@rolster/validators/helpers';

function Account() {
  const emailControl = useInputControl<string>('', [required, email]);
  const notifyControl = useInputControl(true);

  return (
    <div className="account">
      <RlsFieldText formControl={emailControl} placeholder="name@rolster.com">
        Email
      </RlsFieldText>

      <RlsLabelSwitch formControl={notifyControl}>
        Receive notifications by email
      </RlsLabelSwitch>
    </div>
  );
}
```

### Organisms

| Component                        | Description                                                                |
| -------------------------------- | -------------------------------------------------------------------------- |
| `RlsBottomSheet`                 | Panel anchored to the bottom of the screen, with backdrop                  |
| `RlsCard`                        | Content card, with outline variant                                         |
| `RlsChooserAutocomplete`         | Custom trigger that opens an autocomplete list of suggestions              |
| `RlsChooserAutocompleteTemplate` | `RlsChooserAutocomplete` with every element rendered by `render`           |
| `RlsChooserList`                 | Custom trigger that opens a multiple selection list                        |
| `RlsChooserListTemplate`         | `RlsChooserList` with every element rendered by `render`                   |
| `RlsChooserSelect`               | Custom trigger that opens a single selection list                          |
| `RlsChooserSelectTemplate`       | `RlsChooserSelect` with every element rendered by `render`                 |
| `RlsConfirmation`                | Confirmation dialog with approve and reject actions                        |
| `RlsDatatable`                   | Table with toolbar, header, summary and footer, resizable by its content   |
| `RlsDatatableHeader`             | Header row of the table                                                    |
| `RlsDatatableTitle`              | Title cell of the header, with control, actions and truncated variants     |
| `RlsDatatableSubheader`          | Subheader row of the table                                                 |
| `RlsDatatableRecord`             | Record row, with error, info, success, warning and truncated states        |
| `RlsDatatableTotals`             | Totals row of the table                                                    |
| `RlsDatatableCell`               | Record cell, with control, actions and truncated variants                  |
| `RlsDatatableData`               | Cell rendered as a block, for rows outside the table element               |
| `RlsDatatableFloating`           | Floating actions displayed over a record                                   |
| `RlsDropdown`                    | Floating panel positioned by a `DropdownController`                        |
| `RlsFieldAutocomplete`           | Field that filters its suggestions with the typed pattern                  |
| `RlsFieldAutocompleteTemplate`   | `RlsFieldAutocomplete` with every element rendered by `render`             |
| `RlsFieldClock`                  | Field that opens `RlsModalClock` and shows the selected `Time`             |
| `RlsFieldColor`                  | Field that opens the color picker and shows the selected color             |
| `RlsFieldDate`                   | Field that opens `RlsModalDate` and shows the date with the given `format` |
| `RlsFieldDateRange`              | Field that opens `RlsModalDateRange` and shows the selected `DateRange`    |
| `RlsFieldList`                   | Multiple selection field that renders the selected values as chips         |
| `RlsFieldListTemplate`           | `RlsFieldList` with every element rendered by `render`                     |
| `RlsFieldSelect`                 | Single selection field over a list of suggestions                          |
| `RlsFieldSelectTemplate`         | `RlsFieldSelect` with every element rendered by `render`                   |
| `RlsFormNavigation`              | Navigation panel that slides over a form                                   |
| `RlsImageChooser`                | Avatar that opens the file selector and the image editor                   |
| `RlsImageEditor`                 | Image editor with zoom, crop by ratio and export to `ImageEditorValue`     |
| `RlsModal`                       | Modal window with backdrop                                                 |
| `RlsModalClock`                  | Modal that hosts `RlsPickerClock`                                          |
| `RlsModalDate`                   | Modal that hosts `RlsPickerDate`                                           |
| `RlsModalDateRange`              | Modal that hosts `RlsPickerDateRange`                                      |
| `RlsModalSheet`                  | Modal displayed as a sheet, with backdrop                                  |
| `RlsPickerClock`                 | Analog clock to select hour, minute and zone                               |
| `RlsPickerColor`                 | Color picker with saturation canvas, hue, alpha and hexadecimal input      |
| `RlsPickerDate`                  | Calendar with day, month and year views                                    |
| `RlsPickerDateRange`             | Calendar that selects a range of dates                                     |
| `RlsSnackbar`                    | Snackbar with icon, title and content                                      |

```tsx
import { RolsterListElement } from '@rolster/components';
import { RlsFieldSelect } from '@rolster/react-components';
import { useFormControl } from '@rolster/react-forms';

class PersonElement extends RolsterListElement<Person> {
  public override get title(): string {
    return this.value.name;
  }
}

function Assignment({ persons }: { persons: Person[] }) {
  const personControl = useFormControl<Person>();

  const suggestions = persons.map((person) => new PersonElement(person));

  return (
    <RlsFieldSelect
      formControl={personControl}
      suggestions={suggestions}
      placeholder="Select a person"
    >
      Assigned person
    </RlsFieldSelect>
  );
}
```

### Hooks

| Hook                                                 | Description                                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `useRlsContext(): RlsState`                          | Reads the context of `RlsApplication`; throws when the wrapper is missing             |
| `useConfirmation(): ConfirmationService`             | Creates the `confirmation` function and the `RlsConfirmation` node that renders it    |
| `useNotifications(): NotificationsService`           | Creates the `notify` function and the `RlsNotifications` node with the stack          |
| `useSnackbar(): SnackbarService`                     | Creates the `snackbar` function and the `RlsSnackbar` node that renders it            |
| `useFieldAutocomplete(props)`                        | State of an autocomplete field: coincidences, pattern, references and event handlers  |
| `useFieldList(props)`                                | State of a multiple selection field: selected elements, references and event handlers |
| `useFieldSelect(props)`                              | State of a single selection field: value, references and event handlers               |
| `useListController(props)`                           | Base of the previous ones: visibility, keyboard navigation and writing to the control |
| `useDatatable(table?): DatatableController`          | Observes the body of a table and reports whether it is scrollable                     |
| `useDesingSystemController(primary?, secondary?)`    | Applies a design system and toggles between two of them                               |
| `useDropdownController(effect?): DropdownController` | Opens a `RlsDropdown` at a position or from a mouse event                             |
| `usePortalController(): PortalController`            | Visibility of modals, sheets and navigation panels                                    |
| `useTabsController(options): TabsController`         | Creates the control of a tab bar and the `Tabs` node bound to it                      |
| `useImageEditorController(options)`                  | Opens the file selector and the image editor, and returns the node that renders them  |
| `useFormSingleSelectionController(props)`            | `checked` state and selection of a value over a control                               |
| `useFormToggleController(props)`                     | `checked` state and toggle of a `boolean` control                                     |
| `useResize({ refElement, onResize })`                | Reports the dimensions of an element when it changes size                             |
| `useRelocationOnComponent({ container, element })`   | Allows dragging an element inside its container                                       |
| `useEventCallback(callback)`                         | Returns a stable function that always calls the last received callback                |

```tsx
import { RlsButton, useRlsContext } from '@rolster/react-components';

function DeleteAction({ person }: { person: Person }) {
  const { confirmation, snackbar } = useRlsContext();

  const onDelete = async () => {
    const result = await confirmation({
      title: 'Delete person',
      content: <p>{person.name} will be removed from the system.</p>,
      approved: { label: 'Delete', rlsTheme: 'danger' },
      reject: { label: 'Cancel' }
    });

    result.when({
      approved: () => {
        snackbar({ icon: 'checkmark', title: 'Person deleted' });
      }
    });
  };

  return (
    <RlsButton type="flat" rlsTheme="danger" onClick={onDelete}>
      Delete
    </RlsButton>
  );
}
```

### Theme and design system

The application theme is written on the `app-theme` attribute of `document.body`, and the colors of a theme are written as custom properties on that same element.

| Function                                 | Description                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------------- |
| `getAppTheme(): RlsAppTheme`             | Current theme, `light` when nothing has been set                             |
| `setAppTheme(theme)`                     | Writes `light` or `dark` on the application body                             |
| `toggleAppTheme(): RlsAppTheme`          | Switches between `light` and `dark`, and returns the applied theme           |
| `setDesignSystem(designSystem?)`         | Writes the class of the design system on the body and removes the other ones |
| `generateThemePalette(color, theme?)`    | Builds a `ThemePalette` of eleven shades from a hexadecimal color            |
| `setThemeColor(color, theme?)`           | Writes the properties of `generateThemePalette` on the application body      |
| `setErrorsI18n(dictionary)`              | Merges a dictionary into the validation messages of `RlsMessageFormError`    |
| `getRemSize(): number`                   | Font size of the document root in pixels, `16` when it cannot be read        |
| `renderClassStatus(base, status?, add?)` | Builds the class list of a component from a status object                    |
| `rangeFormatTemplate(dateRange)`         | Formats a `DateRange` as `{dd}/{mx}/{yy} - {dd}/{mx}/{yy}`                   |
| `calculateImgDimension(image, size)`     | Dimensions of an image reduced to a maximum size, keeping its proportion     |

Conversion between hexadecimal, RGB, HSV and HSL colors:

| Function                                                               | Description                                                   |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| `hexToRgb`, `hexToHsv`, `hexToHsl`                                     | Convert a hexadecimal color; return `null` when it is invalid |
| `rgbToHex`, `rgbToHsv`, `rgbToHsl`, `hsvToRgb`, `hsvToHex`, `hslToHex` | Convert between the color models                              |
| `hexIsValid`, `normalizeHex`                                           | Validate a hexadecimal color and expand it to `#RRGGBB`       |

The constants `RlsContext`, the React context consumed by `useRlsContext`, and `DEFAULT_COLOR`, the base color `#1780e0` of the palette, are also exported.

```ts
import {
  setDesignSystem,
  setThemeColor,
  toggleAppTheme
} from '@rolster/react-components';

setDesignSystem('gradient');
setThemeColor('#1780e0', 'primary');

toggleAppTheme(); // 'dark'
```

### Types

| Type                             | Description                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `RlsTheme`                       | Color theme of a component, applied with the `rlsTheme` prop                    |
| `RlsAppTheme`                    | Application theme, `light` or `dark`                                            |
| `RlsDesignSystem`                | Design system, `bordered`, `filled` or `gradient`                               |
| `RlsButtonType`                  | Button style, `ghost`, `flat` or `raised`                                       |
| `PropsWithClassName`             | Props with an optional `className`                                              |
| `PropsWithRlsTheme`              | Props with an optional `rlsTheme`                                               |
| `RlsComponent`                   | Base props of a component: `children`, `className`, `identifier` and `rlsTheme` |
| `InputProps<T>`                  | Props of an input: value, control, state and events                             |
| `FieldProps<T>`                  | `InputProps` plus `action`, `groupModeEnabled` and `msgErrorDisabled`           |
| `RolsterReactInputControl<T>`    | Control of an `input`, with or without an undefined value                       |
| `RolsterReactAreaTextControl<T>` | Control of a `textarea`, with or without an undefined value                     |
| `Confirmation`                   | Function that opens the dialog and resolves with a `ConfirmationResult`         |
| `ConfirmationResult`             | Result of the dialog, resolved as `approved` or `reject`                        |
| `SnackbarConfig`                 | Configuration of a snackbar: `icon`, `title`, `content` and `rlsTheme`          |
| `NotificationsConfig`            | Configuration of a notification, a `SnackbarConfig` plus `duration`             |
| `PaginationEvent<T>`             | Event of `RlsPagination`: page, limits and suggestions of the page              |
| `Tab<T>`                         | Tab of `RlsTabs`: label, value and disabled state                               |
| `NavbarMenuOption`               | Option of `RlsNavbarMenu`: identifier, icon and label                           |
| `ImageEditorValue`               | Result of the image editor: `base64` and `blob`                                 |
| `ThemePalette`                   | Palette generated for a theme: shades, custom properties and CSS                |
| `HSV`, `RGB`, `HSL`              | Color models used by the conversion functions                                   |

## Contributing

- Daniel Andrés Castillo Pedroza :rocket:
