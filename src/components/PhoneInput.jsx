import { countries, findCountry } from '../data/countries'

export default function PhoneInput({ country, number, onCountryChange, onNumberChange, error }) {
  const selected = findCountry(country)

  return (
    <label>
      Telefone
      <div className="phone-input">
        <select
          className="phone-input__country"
          value={selected.code}
          onChange={(event) => onCountryChange(event.target.value)}
          aria-label="País do telefone"
        >
          {countries.map((option) => (
            <option key={option.code} value={option.code}>
              {option.dial} {option.label}
            </option>
          ))}
        </select>
        <input
          type="tel"
          className="phone-input__number"
          placeholder={`Ex.: ${selected.example}`}
          value={number}
          onChange={(event) => onNumberChange(event.target.value)}
        />
      </div>
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}
