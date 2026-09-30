import { findCountry } from '../data/countries'

export function isValidName(value) {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/.test(value.trim())
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function getPasswordRequirements(value) {
  return [
    { key: 'length', label: 'Mínimo 6 caracteres', met: value.length >= 6 },
    { key: 'lowercase', label: 'Uma letra minúscula', met: /[a-z]/.test(value) },
    { key: 'uppercase', label: 'Uma letra maiúscula', met: /[A-Z]/.test(value) },
    { key: 'number', label: 'Um número', met: /[0-9]/.test(value) },
    { key: 'symbol', label: 'Um símbolo (ex.: ! # @ %)', met: /[^A-Za-z0-9]/.test(value) },
  ]
}

export function isValidPassword(value) {
  return getPasswordRequirements(value).every((requirement) => requirement.met)
}

export function isValidPhoneNumber(value, countryCode) {
  const digits = value.replace(/\D/g, '')
  const country = findCountry(countryCode)
  return country.digits.includes(digits.length)
}

export function isValidCep(value) {
  return /^\d{5}-?\d{3}$/.test(value.trim())
}

export function isNotEmpty(value) {
  return value.trim().length > 0
}

const BR_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

export function isValidBrState(value) {
  return BR_STATES.includes(value.trim().toUpperCase())
}
