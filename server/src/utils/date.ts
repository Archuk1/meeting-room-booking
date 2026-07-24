export function isValidTimeRange(startTime: Date, endTime: Date): boolean {
  return startTime.getTime() < endTime.getTime();
}

export function rangesOverlap(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
  return startA.getTime() < endB.getTime() && endA.getTime() > startB.getTime();
}
