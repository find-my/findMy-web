import React from 'react';
import { classNames } from '../libs/front/utils';
interface Props {
  textSize: string;
}

//textSize ex)text-4xl
function ServiceLogo({ textSize }: Props) {
  return <span className={classNames(textSize, 'font-nanum-pen-script text-blue-400 text-center')}>어딨지?</span>;
}

export default React.memo(ServiceLogo);
