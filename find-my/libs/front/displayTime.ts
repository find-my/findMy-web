//1시간 이내 게시된 건 ..분전,하루 이내에 게시된건 ..시간전,올해 안에 게시된건 n월m일 나머지는 y/m/d
export function displayTimeForDetail(createdAt: string) {
  if (!createdAt) return;
  const now = new Date();
  const year = now.getFullYear();

  const createdArr = createdAt.split('-');
  const createdY = createdArr[0];
  const createdM = createdArr[1];
  const createdD = createdArr[2].split('T')[0];
  const createdH = createdArr[2].split('T')[1].split(':')[0];
  const createdMin = createdArr[2].split('T')[1].split(':')[1];
  //createdAt.getTime();
  console.log(now, createdArr, createdY, createdM, createdD, createdH, createdMin);

  const Y_SAME = year === +createdY;

  if (Y_SAME) {
    return `${createdM}/${createdD} ${createdH}:${createdMin}`;
  }
  return `${createdY}/${createdM}/${createdD} ${createdH}:${createdMin}`;
}

//y/m/d/h/m or m/d/h/m
export function displayTimeForList(createdAt: string) {
  if (!createdAt) return;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDay();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  const createdArr = createdAt.split('-');
  const createdY = createdArr[0];
  const createdM = createdArr[1];
  const createdD = createdArr[2].split('T')[0];
  const createdH = createdArr[2].split('T')[1].split(':')[0];
  const createdMin = createdArr[2].split('T')[1].split(':')[1];
  //createdAt.getTime();

  const YMDH_SAME = year === +createdY && month === +createdM && day === +createdM && hour === +createdH;
  const YMD_SAME = year === +createdY && month === +createdM && day === +createdM;
  const Y_SAME = year === +createdY;
  if (YMDH_SAME) {
    const diff = minutes - +createdMin;
    if (diff === 0) return '방금전';
    return `${diff}분전`;
  } else if (YMD_SAME) {
    return `${hour - +createdH}시간전`;
  } else if (Y_SAME) {
    return `${createdM}/${createdD}`;
  }
  return `${createdY}/${createdM}/${createdD}`;
}
