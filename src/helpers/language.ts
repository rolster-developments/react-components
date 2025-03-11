import {
  I18nDictionary,
  I18nTranslate,
  LanguageCode,
  i18n
} from '@rolster/i18n';
import { Interpolators } from '@rolster/strings';

const errorsDictionary: I18nDictionary = {
  es: {
    alphabetic: 'Campo solo permite caracteres',
    alphanumber: 'Campo solo permite caracteres y número',
    decimal: 'Campo debe ser número decimal',
    defined: 'Campo debe estar definido',
    email: 'Campo debe ser correo electrónico',
    greaterThanValue: 'Campo debe tener un valor mayor a {thanValue}',
    greaterOrEqualsThanValue:
      'Campo debe tener un valor mayor o igual a {thanValue}',
    lessThanValue: 'Campo debe tener un valor menor a {thanValue}',
    lessOrEqualsThanValue:
      'Campo debe tener un valor menor o igual a {thanValue}',
    maxValue: 'Campo debe tener un valor máximo de {thanValue}',
    minValue: 'Campo debe tener un valor mínimo de {thanValue}',
    nickname: 'Campo inválido para nombre de usuario',
    onlynumber: 'Campo debe ser númerico',
    password: 'Campo no permitido para password',
    reqlength: 'Campo debe tener {length} caracter(es)',
    required: 'Campo es requerido',
    strMinlength: 'Campo debe tener mínimo {length} caracter(es)',
    strMaxlength: 'Campo debe tener máximo {length} caracter(es)',
    textonly: 'Campo solo permite caracteres (sin espacio)',
    _unknown: 'Campo inválido {error}'
  },
  en: {
    alphabetic: 'Field only allows characters',
    alphanumber: 'Field only allows characters and number',
    decimal: 'Field must be decimal number',
    defined: 'Field must be defined',
    email: 'Field must be email',
    greaterThanValue: 'Field must have a value greater than {thanValue}',
    greaterOrEqualsThanValue:
      'Field must have a value greater than or equal to {thanValue}',
    lessThanValue: 'Field must have a value less than {thanValue}',
    lessOrEqualsThanValue:
      'Field must have a value less than or equal to {thanValue}',
    minValue: 'Field must have a minimum value of {thanValue}',
    maxValue: 'Field must have a maximum value of {thanValue}',
    nickname: 'Invalid field for username',
    onlynumber: 'Field must be numeric',
    password: 'Field not allowed for password',
    reqlength: 'Field must be {length} characters',
    required: 'Field is required',
    strMinlength: 'Field must have minimum {length} characters',
    strMaxlength: 'Field must have maximum {length} characters',
    textonly: 'Field only allows characters (no space)',
    _unknown: 'Invalid field {error}'
  },
  fr: {
    alphabetic: 'Field only allows characters',
    alphanumber: 'Field only allows characters and number',
    decimal: 'Field must be decimal number',
    defined: 'Field must be defined',
    email: 'Field must be email',
    greaterThanValue: 'Field must have a value greater than {thanValue}',
    greaterOrEqualsThanValue:
      'Field must have a value greater than or equal to {thanValue}',
    lessThanValue: 'Field must have a value less than {thanValue}',
    lessOrEqualsThanValue:
      'Field must have a value less than or equal to {thanValue}',
    minValue: 'Field must have a minimum value of {thanValue}',
    maxValue: 'Field must have a maximum value of {thanValue}',
    nickname: 'Invalid field for username',
    onlynumber: 'Field must be numeric',
    password: 'Field not allowed for password',
    reqlength: 'Field must be {length} characters',
    required: 'Field is required',
    strMinlength: 'Field must have minimum {length} characters',
    strMaxlength: 'Field must have maximum {length} characters',
    textonly: 'Field only allows characters (no space)',
    _unknown: 'Invalid field {error}'
  },
  pt: {
    alphabetic: 'Field only allows characters',
    alphanumber: 'Field only allows characters and number',
    decimal: 'Field must be decimal number',
    defined: 'Field must be defined',
    email: 'Field must be email',
    greaterThanValue: 'Field must have a value greater than {thanValue}',
    greaterOrEqualsThanValue:
      'Field must have a value greater than or equal to {thanValue}',
    lessThanValue: 'Field must have a value less than {thanValue}',
    lessOrEqualsThanValue:
      'Field must have a value less than or equal to {thanValue}',
    minValue: 'Field must have a minimum value of {thanValue}',
    maxValue: 'Field must have a maximum value of {thanValue}',
    nickname: 'Invalid field for username',
    onlynumber: 'Field must be numeric',
    password: 'Field not allowed for password',
    reqlength: 'Field must be {thanValue} characters',
    required: 'Field is required',
    strMinlength: 'Field must have minimum {thanValue} characters',
    strMaxlength: 'Field must have maximum {thanValue} characters',
    textonly: 'Field only allows characters (no space)',
    _unknown: 'Invalid field {error}'
  }
};

let _msgErrorsI18n: I18nTranslate = i18n(errorsDictionary);

export function setErrorsI18n(dictionary: I18nDictionary) {
  _msgErrorsI18n = i18n(
    Object.entries(errorsDictionary).reduce((_dictionary, [key, value]) => {
      _dictionary[key] = { ...value, ...(dictionary as any)[key] };

      return _dictionary;
    }, {} as any)
  );
}

export function msgErrorsI18n(
  key: string,
  language: LanguageCode,
  interpolators?: Interpolators
) {
  return _msgErrorsI18n(key, { language, interpolators });
}
