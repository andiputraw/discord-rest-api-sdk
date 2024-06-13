export function delay(seconds: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(res, seconds * 1000);
  });
}

export function objectToQueryString(obj: object | undefined): string {
  return new URLSearchParams(obj as any).toString();
}
