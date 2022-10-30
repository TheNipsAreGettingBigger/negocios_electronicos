import { ResponseSunat } from "../interfaces"


export const rucService = async (ruc:string):Promise<ResponseSunat> => {
  const token = import.meta.env.VITE_TOKEN_RUC
  const response = await fetch('https://www.softwarelion.xyz/api/sunat/consulta-ruc',{
    method:'POST',
    body:JSON.stringify({ ruc }),
    headers:{
      'Authorization': 'Bearer '+token,
      'Content-Type':'application/json'
    }
  })
  const payload = await response.json()
  return payload as ResponseSunat
  // return {} as ResponseSunat
}
