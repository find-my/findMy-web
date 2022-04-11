import React from 'react';
import { classNames } from '../libs/front/utils';
interface Props {
  textSize: string;
}

//textSize ex)text-4xl
function ServiceLogo({ textSize }: Props) {
  return <h3 className={classNames(textSize, 'font-nanum-pen-script text-blue-400 text-center')}>어딨지?</h3>;
}

export default React.memo(ServiceLogo);
