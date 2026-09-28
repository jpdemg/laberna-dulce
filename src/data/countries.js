export const countries = [
  { code: 'BR', dial: '+55', label: 'Brasil', example: '11 98765-4321', digits: [10, 11] },
  { code: 'PT', dial: '+351', label: 'Portugal', example: '912 345 678', digits: [9] },
  { code: 'US', dial: '+1', label: 'Estados Unidos', example: '(202) 555-0143', digits: [10] },
  { code: 'AR', dial: '+54', label: 'Argentina', example: '11 2345-6789', digits: [10, 11] },
  { code: 'CL', dial: '+56', label: 'Chile', example: '9 8765 4321', digits: [9] },
  { code: 'UY', dial: '+598', label: 'Uruguai', example: '94 123 456', digits: [8] },
  { code: 'PY', dial: '+595', label: 'Paraguai', example: '961 456 789', digits: [9] },
  { code: 'MX', dial: '+52', label: 'México', example: '55 1234 5678', digits: [10] },
  { code: 'ES', dial: '+34', label: 'Espanha', example: '612 34 56 78', digits: [9] },
]

export function findCountry(code) {
  return countries.find((country) => country.code === code) ?? countries[0]
}
