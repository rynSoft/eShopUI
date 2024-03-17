// ** Third Party Components
import { useTranslation } from 'react-i18next'
import ReactCountryFlag from 'react-country-flag'
// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'

const IntlDropdown = () => {
  const { t, i18n } = useTranslation()

  const handleLangUpdate = (e, lang) => {
    e.preventDefault()
    i18n.changeLanguage(lang)
  }

  return (
    <UncontrolledDropdown href='/' tag='li' className='dropdown-language nav-item me-25'>
      <DropdownToggle href='/' tag='a' className='nav-link' onClick={e => e.preventDefault()}
      >
        <ReactCountryFlag
          svg
          className=''
          style={{
            fontSize: '2em',
            lineHeight: '2em',
          }}
          countryCode={i18n.language === 'en' ? 'us' : i18n.language.split("-")[0]}
        />
      </DropdownToggle>
      <DropdownMenu className='mt-0' end>
        <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'tr')}>
          <ReactCountryFlag className='country-flag' countryCode='tr' svg />
          <span className='ms-1'>Turkish</span>
        </DropdownItem>
        <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'en')}>
          <ReactCountryFlag className='country-flag' countryCode='us' svg />
          <span className='ms-1'>English</span>
        </DropdownItem>

      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default IntlDropdown
