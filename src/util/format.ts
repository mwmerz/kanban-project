export function Base64Encode(x: string) {
  return Buffer.from(x).toString("base64");
}

export function Base64Decode(x: string) {
  return Buffer.from(x).toString("utf8");
}
