import { RolsterListElement } from '@rolster/components';
import { useFormControl, useInputControl } from '@rolster/react-forms';
import { useCallback, useState } from 'react';
import {
  RlsAvatar,
  RlsButtonAction,
  RlsChip,
  RlsFieldSelect,
  RlsFieldText,
  RlsLabelRadioButton
} from '../../index';
import {
  CITIES,
  GENDERS,
  HOURLY_RATES,
  INTERESTS,
  SKILLS,
  STATES
} from '../data/profile';
import { profileEmailError } from '../helpers/profile';

import './InputsPage.scss';

const STATE_OPTIONS = STATES.map((state) => new RolsterListElement(state));
const CITY_OPTIONS = CITIES.map((city) => new RolsterListElement(city));
const INTEREST_OPTIONS = INTERESTS.map(
  (interest) => new RolsterListElement(interest)
);

export function InputsPage() {
  const emailControl = useInputControl<string>('', [profileEmailError]);
  const firstNameControl = useInputControl<string>('Active');
  const secondNameControl = useInputControl<string>('');
  const zipControl = useInputControl<string>('87101');
  const streetControl = useInputControl<string>('');

  const stateControl = useFormControl<string>('New Mexico');
  const cityControl = useFormControl<string>('Albuquerque');
  const interestControl = useFormControl<string>('Science');
  const rateControl = useFormControl<string>('$10-20');
  const genderControl = useFormControl<string>('Female');

  const [skills, setSkills] = useState<string[]>(SKILLS);

  const onRemoveSkill = useCallback((skill: string) => {
    setSkills((state) => state.filter((value) => value !== skill));
  }, []);

  return (
    <section className="inputs-page rls-flex-xs-grid-16 rls-flex-xs-grid-col-2">
      <div className="inputs-page__column">
        <header className="inputs-page__intro">
          <span className="rls-subtitle-font">User Information</span>

          <p className="rls-body-font">
            Enter the required information below to register. You can change it
            anytime you want.
          </p>
        </header>

        <RlsFieldText
          formControl={emailControl}
          placeholder="username@domain.com"
        >
          Email address
        </RlsFieldText>

        <div className="inputs-page__row">
          <RlsFieldText formControl={firstNameControl} placeholder="First Name">
            Full name
          </RlsFieldText>

          <RlsFieldText
            formControl={secondNameControl}
            placeholder="Second Name"
          >
            &nbsp;
          </RlsFieldText>
        </div>

        <div className="inputs-page__row">
          <RlsFieldSelect
            formControl={stateControl}
            suggestions={STATE_OPTIONS}
            placeholder="State"
          >
            Address
          </RlsFieldSelect>

          <RlsFieldSelect
            formControl={cityControl}
            suggestions={CITY_OPTIONS}
            placeholder="City"
            disabled={true}
          >
            &nbsp;
          </RlsFieldSelect>

          <RlsFieldText formControl={zipControl} placeholder="ZIP">
            &nbsp;
          </RlsFieldText>
        </div>

        <RlsFieldText formControl={streetControl} placeholder="Street">
          &nbsp;
        </RlsFieldText>

        <div className="inputs-page__group">
          <span className="rls-label-font">Hourly rate</span>

          <div className="rls-flex-xs-grid-12 rls-flex-xs-grid-col-2">
            {HOURLY_RATES.map((rate) => (
              <RlsLabelRadioButton
                key={rate}
                formControl={rateControl}
                value={rate}
                extended={true}
              >
                {rate}
              </RlsLabelRadioButton>
            ))}
          </div>
        </div>

        <div className="inputs-page__group">
          <span className="rls-label-font">Choose your skills</span>

          <div className="inputs-page__skills">
            {skills.map((skill) => (
              <RlsChip
                key={skill}
                selected={true}
                onRemove={() => onRemoveSkill(skill)}
              >
                {skill}
              </RlsChip>
            ))}
          </div>
        </div>
      </div>

      <div className="inputs-page__column">
        <div className="inputs-page__group">
          <span className="rls-label-font">Profile photo</span>

          <div className="inputs-page__photo">
            <RlsAvatar rlsTheme="primary">
              <span>SS</span>
            </RlsAvatar>

            <RlsButtonAction icon="edit" tooltip="Cambiar foto" />
          </div>
        </div>

        <RlsFieldSelect
          formControl={interestControl}
          suggestions={INTEREST_OPTIONS}
          placeholder="Select an interest"
        >
          Choose your main interest
        </RlsFieldSelect>

        <div className="inputs-page__group">
          <span className="rls-label-font">Select your gender</span>

          <div className="inputs-page__skills">
            {GENDERS.map((gender) => (
              <RlsLabelRadioButton
                key={gender}
                formControl={genderControl}
                value={gender}
              >
                {gender}
              </RlsLabelRadioButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
