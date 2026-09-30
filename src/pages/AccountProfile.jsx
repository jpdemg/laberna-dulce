import { useEffect, useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../context/AuthContext'
import useHCaptcha from '../hooks/useHCaptcha'
import PhoneInput from '../components/PhoneInput'
import { paymentMethodLabels } from '../lib/paymentMethods'
import { fetchAddressByCep } from '../lib/viacep'
import {
  isNotEmpty,
  isValidBrState,
  isValidCep,
  isValidName,
  isValidPassword,
  getPasswordRequirements,
  isValidPhoneNumber,
} from '../lib/validators'

const emptyAddress = {
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zip: '',
}

export default function AccountProfile() {
  const { profile, loading: profileLoading, saveProfile } = useProfile()
  const { user, signIn, updatePassword } = useAuth()
  const { containerRef, execute, reset } = useHCaptcha()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneCountry, setPhoneCountry] = useState('BR')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState(emptyAddress)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  useEffect(() => {
    if (!profile) return
    setFirstName(profile.first_name ?? '')
    setLastName(profile.last_name ?? '')
    setPhoneNumber(profile.phone ?? '')
    setPhoneCountry(profile.phone_country ?? 'BR')
    setAddress({ ...emptyAddress, ...(profile.address ?? {}) })
  }, [profile])

  const updateAddressField = (field) => (event) =>
    setAddress((current) => ({ ...current, [field]: event.target.value }))

  const handleCepChange = (event) => {
    updateAddressField('zip')(event)
    const digits = event.target.value.replace(/\D/g, '')
    if (digits.length === 8) {
      setCepLoading(true)
      fetchAddressByCep(digits).then((found) => {
        setCepLoading(false)
        if (found) setAddress((current) => ({ ...current, ...found }))
      })
    }
  }

  const handleCepBlur = async () => {
    setCepLoading(true)
    const found = await fetchAddressByCep(address.zip)
    setCepLoading(false)
    if (found) setAddress((current) => ({ ...current, ...found }))
  }

  const validate = () => {
    const errors = {}
    if (!isValidName(firstName)) errors.firstName = 'Digite um nome válido (mínimo 2 letras).'
    if (!isValidName(lastName)) errors.lastName = 'Digite um sobrenome válido (mínimo 2 letras).'
    if (phoneNumber && !isValidPhoneNumber(phoneNumber, phoneCountry)) {
      errors.phone = 'Digite um telefone válido para o país selecionado.'
    }
    const hasAnyAddress = Object.values(address).some(isNotEmpty)
    if (hasAnyAddress) {
      if (!isValidCep(address.zip)) errors.zip = 'Digite um CEP válido, com 8 dígitos.'
      if (!isNotEmpty(address.street)) errors.street = 'Informe o nome da rua.'
      if (!isNotEmpty(address.number)) errors.number = 'Informe o número.'
      if (!isNotEmpty(address.neighborhood)) errors.neighborhood = 'Informe o bairro.'
      if (!isNotEmpty(address.city)) errors.city = 'Informe a cidade.'
      if (!isValidBrState(address.state)) errors.state = 'Use a sigla do estado, com 2 letras (ex.: SP).'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveProfile = async (event) => {
    event.preventDefault()
    setSaved(false)
    if (!validate()) return

    setSaving(true)
    await saveProfile({
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`.trim(),
      phone: phoneNumber,
      phone_country: phoneCountry,
      address,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleChangePassword = async (event) => {
    event.preventDefault()
    setPasswordSaved(false)
    setPasswordError('')

    if (!isValidPassword(newPassword)) {
      setPasswordError('A nova senha precisa cumprir todos os requisitos abaixo.')
      return
    }

    setPasswordSaving(true)

    let captchaToken
    try {
      captchaToken = await execute()
    } catch {
      setPasswordSaving(false)
      setPasswordError('Não foi possível validar o captcha. Tente novamente.')
      return
    }

    const { error: reauthError } = await signIn({ email: user.email, password: currentPassword, captchaToken })
    reset()

    if (reauthError) {
      setPasswordSaving(false)
      setPasswordError('Senha atual incorreta.')
      return
    }

    const { error: updateError } = await updatePassword(newPassword)
    setPasswordSaving(false)

    if (updateError) {
      setPasswordError(updateError.message)
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 2000)
  }

  return (
    <section className="account-page__profile">
      <form onSubmit={handleSaveProfile} className="checkout-form">
        <fieldset>
          <legend>Cadastro</legend>
          <div className="checkout-form__row">
            <label>
              Nome
              <input
                placeholder="Ex.: Maria"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
            </label>
            <label>
              Sobrenome
              <input
                placeholder="Ex.: Oliveira"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
            </label>
          </div>

          <PhoneInput
            country={phoneCountry}
            number={phoneNumber}
            onCountryChange={setPhoneCountry}
            onNumberChange={setPhoneNumber}
            error={fieldErrors.phone}
          />
        </fieldset>

        <fieldset>
          <legend>Endereço de entrega salvo</legend>
          <label>
            CEP {cepLoading && '(buscando endereço...)'}
            <input
              placeholder="Ex.: 04530-001"
              value={address.zip}
              onChange={handleCepChange}
              onBlur={handleCepBlur}
            />
            {fieldErrors.zip && <span className="field-error">{fieldErrors.zip}</span>}
          </label>
          <label>
            Rua
            <input
              placeholder="Ex.: Rua Cel. Artur de Paula Ferreira"
              value={address.street}
              onChange={updateAddressField('street')}
            />
            {fieldErrors.street && <span className="field-error">{fieldErrors.street}</span>}
          </label>
          <div className="checkout-form__row">
            <label>
              Número
              <input
                placeholder="Ex.: 135"
                value={address.number}
                onChange={updateAddressField('number')}
              />
              {fieldErrors.number && <span className="field-error">{fieldErrors.number}</span>}
            </label>
            <label>
              Complemento
              <input
                placeholder="Ex.: Apto 45 (opcional)"
                value={address.complement}
                onChange={updateAddressField('complement')}
              />
            </label>
          </div>
          <label>
            Bairro
            <input
              placeholder="Ex.: Vila Nova Conceição"
              value={address.neighborhood}
              onChange={updateAddressField('neighborhood')}
            />
            {fieldErrors.neighborhood && <span className="field-error">{fieldErrors.neighborhood}</span>}
          </label>
          <div className="checkout-form__row">
            <label>
              Cidade
              <input
                placeholder="Ex.: São Paulo"
                value={address.city}
                onChange={updateAddressField('city')}
              />
              {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
            </label>
            <label>
              Estado
              <input
                placeholder="Ex.: SP"
                value={address.state}
                onChange={updateAddressField('state')}
                maxLength={2}
              />
              {fieldErrors.state && <span className="field-error">{fieldErrors.state}</span>}
            </label>
          </div>
        </fieldset>

        {profile?.last_payment_method && (
          <p className="checkout-form__hint">
            Último método de pagamento usado:{' '}
            {paymentMethodLabels[profile.last_payment_method] ?? profile.last_payment_method}
          </p>
        )}

        <button
          type="submit"
          className={`btn btn--primary btn--confirm-pulse ${saved ? 'is-confirmed' : ''}`}
          disabled={saving || profileLoading}
        >
          {saving ? 'Salvando...' : saved ? 'Salvo ✓' : 'Salvar dados'}
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="checkout-form">
        <fieldset>
          <legend>Trocar senha</legend>

          <label>
            Senha atual
            <input
              type="password"
              placeholder="Sua senha atual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>

          <label>
            Nova senha
            <input
              type="password"
              placeholder="Ex.: Docinho#25"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <ul className="password-requirements">
              {getPasswordRequirements(newPassword).map((requirement) => (
                <li
                  key={requirement.key}
                  className={`password-requirements__item ${requirement.met ? 'is-met' : ''}`}
                >
                  <span className="password-requirements__icon" aria-hidden="true">
                    {requirement.met ? '✓' : '○'}
                  </span>
                  {requirement.label}
                </li>
              ))}
            </ul>
          </label>

          {passwordError && <p className="field-error">{passwordError}</p>}

          <div ref={containerRef} />

          <button
            type="submit"
            className={`btn btn--outline btn--confirm-pulse ${passwordSaved ? 'is-confirmed' : ''}`}
            disabled={passwordSaving}
          >
            {passwordSaving ? 'Salvando...' : passwordSaved ? 'Senha alterada ✓' : 'Trocar senha'}
          </button>
        </fieldset>
      </form>
    </section>
  )
}
