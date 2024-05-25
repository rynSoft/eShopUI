import React from 'react'
import * as icons from "react-feather";
import { useSkin } from '@hooks/useSkin'

export function DynamicIcon({ name,  ...rest }) {
  const { skin} = useSkin()
  const IconComponent = icons[name];
  //return <IconComponent color={skin=="light"?"black":"white"} {...rest} />;
  return <IconComponent {...rest} />;
}