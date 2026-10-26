/** Change the screen while the back of the phone is facing the visitor. */
export function phoneShowcaseFrame(progress: number, count: number) {
  const bounded = Math.max(0, Math.min(1, progress));
  const rotation = bounded * Math.max(0, count - 1) * 360;
  return { rotation, index: Math.min(Math.max(0, count - 1), Math.floor((rotation + 180) / 360)) };
}
