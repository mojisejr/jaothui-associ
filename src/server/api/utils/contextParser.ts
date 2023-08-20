type InputData = {
  "0": {
    json: {
      accessToken: string;
      wallet: string;
    };
  };
};
export function contextParser(input: string) {
  try {
    const data = JSON.parse(input) as InputData;
    const json = data["0"].json as { accessToken?: string; wallet?: string };
    if (json != undefined || json != null) {
      return json;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
