export interface RespostaPadraoInterface {
  ok: boolean
  mensagem: string
}

type JSONValue =
  | string
  | number
  | boolean
  | JSONObject
  | JSONArray;

export interface JSONObject {
  [x: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> { }
