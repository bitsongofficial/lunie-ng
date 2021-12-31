export const urlSafeEncode = (value: string) => {
  return value.replace('+/gi', '_').replace('\//gi', '-');
}
