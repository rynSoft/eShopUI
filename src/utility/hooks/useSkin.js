// ** React Imports
import { useEffect,useState } from 'react'

// ** Store Imports
import { handleSkin } from '@store/layout'
import { useDispatch, useSelector } from 'react-redux'
import { useThemeSwitcher } from "react-css-theme-switcher";
export const useSkin = () => {

  const [show, setShow] = useState(0)
  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.layout)

  const setSkin = type => {
    dispatch(handleSkin(type))
  }

  useEffect(() => {
    // ** Get Body Tag
    const element = window.document.body

    // ** Define classnames for skins
    const classNames = {
      dark: 'dark-layout',
      bordered: 'bordered-layout',
      'semi-dark': 'semi-dark-layout'
    }

    // ** Remove all classes from Body on mount
    element.classList.remove(...element.classList)

    // ** If skin is not light add skin class
    if (store.skin !== 'light') {

      element.classList.add(classNames[store.skin])
    }

    else{

    }
  }, [store.skin])

  return { skin: store.skin, setSkin }
}
