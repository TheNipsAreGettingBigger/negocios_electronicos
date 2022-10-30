export interface ResponseSunat {
  success: boolean;
  message: string;
  result:  Result;
}

export interface Result {
  ruc:                string;
  razonSocial:        string;
  nombreComercial:    string;
  estado:             string;
  condicion:          string;
  direccion:          string;
  departamento:       string;
  provincia:          string;
  distrito:           string;
  tipoContribuyente:  string;
  fechaInscripcion:   string;
  fechaInicio:        string;
  actividadPrincipal: string;
  otrasActividades:   string[];
}
