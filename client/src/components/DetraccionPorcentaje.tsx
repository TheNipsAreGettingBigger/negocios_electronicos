import { useEffect, useState } from "react"

const anexo3 = [10,12,4,12]
// 1.5 = 2
const anexo2 = [4,10,15,2]

export const DetraccionPorcentaje = ({ porcentaje } : {porcentaje:number}) => {
  
  const [a3,setA3] = useState<string | null>(null)
  const [a2,setA2] = useState<string | null>(null)
  useEffect(()=>{
    console.log({porcentaje})
    console.log(anexo2.indexOf(porcentaje));
    console.log(anexo3.indexOf(porcentaje));
    if(anexo2.indexOf(porcentaje) != -1){
      console.log('entre seta2')
      setA2('ANEXO 2 - COMPRA DE BIENES')
    }
    if(anexo3.indexOf(porcentaje) != -1){
      console.log('entre seta3')
      setA3('ANEXO 3 - COMPRA DE SERVICIOS')
    }
  },[porcentaje])
  
  return (
    <div className="flex flex-col text-[#2a8cb3] font-semibold text-sm mb-4">
      <h3 className="font-bold">SPOT</h3>
      <p>Porcentaje : { porcentaje + '%' }</p>
      {
        <p>
          { a2 && <span>TIPO : {a2}</span> }
          {(a2 && a3) && <span> o </span>}
          { a3 && <span>TIPO : {a3}</span> }
        </p> 
      }
    </div>
  )
}
