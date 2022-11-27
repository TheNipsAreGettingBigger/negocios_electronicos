import { useEffect, useLayoutEffect, useState } from "react"
import X2JS from "x2js"
import { rucService } from "../services"
import { Spinner } from "./Spinner"
import { Tabs } from "./Tabs"

type ReceiptTableProps = {
  xml: string,
}

export const ReceiptTable = ({ xml }: ReceiptTableProps) => {

  const [recibo, setRecibo] = useState<any>()
  const [informationUsers,setInformationUsers] = useState<any>({})
  const [isLoading,setLoading] = useState(true)

  useLayoutEffect(() => {
    var x2js = new X2JS();
    var json = x2js.xml2js(xml) as any
    console.log(json);
    const OrderReference = json.Invoice.OrderReference
    // emisor
    const AccountingSupplierParty = json.Invoice.AccountingSupplierParty
    // receptor o adquirente
    const AccountingCustomerParty = json.Invoice.AccountingCustomerParty
    const InvoiceLine = json.Invoice.InvoiceLine
    const LegalMonetaryTotal = json.Invoice.LegalMonetaryTotal
    setRecibo({
      emisor: AccountingSupplierParty,
      adquirente: AccountingCustomerParty,
      OrderReference,
      InvoiceLine,LegalMonetaryTotal
    })

    rucService(AccountingSupplierParty.CustomerAssignedAccountID.toString()).then(response => {
      // setRucInfomation(response.result)
      setInformationUsers((users:any)=>({
        ...users,
        emisor:response.result
      }))
      rucService(AccountingCustomerParty.CustomerAssignedAccountID.toString()).then(response => {
        setInformationUsers((users:any)=>({
          ...users,
          adquirente:response.result
        }))
        setLoading(false)
      })
    })

  }, [])
  if (isLoading) return <Spinner />
  return (
    <>
      <div>
        <div className="border-stone-900 flex border-t-[1px] border-b-[1px] py-4 px-2">
          <div className="w-[70%]">
            <div className="p-2 grid gap-2">
              <p className="font-bold">{ }</p>
              <p>{recibo?.emisor?.Party?.PartyName?.Name?.toString()}</p>
              <p>{recibo?.emisor?.Party?.PostalAddress?.StreetName?.toString()}</p>
            </div>
          </div>
          <div className="flex-1" >
            <div className="border-stone-900 border-[1px] p-2 text-center font-bold">
              <p>RUC: {recibo?.emisor?.CustomerAssignedAccountID.toString()}</p>
              <p>RECIBO POR HONORARIOS</p>
              <p>{recibo?.OrderReference?.ID.toString()}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex py-4 px-2 pb-0">
            <div className="w-[70%]">
              <p className="w-full flex">
                <span className="w-[40%] flex justify-between">
                  <span>Recibí de</span>
                  <span>:</span>
                </span>
                <span className="w-[60%] ml-2 font-semibold">{recibo?.adquirente?.Party?.PartyName?.Name?.toString()}</span>
              </p>
              <p className="w-full flex">
                <span className="w-[40%] flex justify-between">
                  <span>Identificado Con</span>
                  <span>:</span>
                </span>
                <span className="w-[60%] ml-2 font-semibold">{'RUC'}</span>
              </p>
              <p className="w-full flex">
                <span className="w-[40%] flex justify-between">
                  <span>Número</span>
                  <span>:</span>
                </span>
                <span className="w-[60%] ml-2 font-semibold">{recibo?.adquirente?.CustomerAssignedAccountID.toString()}</span>
              </p>
              <p className="w-full flex">
                <span className="w-[40%] flex justify-between">
                  <span>Domicilio del Usuario</span>
                  <span>:</span>
                </span>
                <span className="w-[60%] ml-2 font-semibold text-sm flex items-center">{recibo?.adquirente?.Party?.PostalAddress?.StreetName?.toString()}</span>
              </p>
              <p className="w-full flex">
                <span className="w-[40%] flex justify-between">
                  <span>Por concepto De</span>
                  <span>:</span>
                </span>
                <span className="w-[60%] ml-2 font-semibold text-sm flex items-center">{recibo?.InvoiceLine?.Item?.Description?.toString()}</span>
              </p>
              <p className="w-full flex">
                <span className="w-[40%] flex justify-between">
                  <span>Total por honorarios</span>
                  <span>:</span>
                </span>
                <span className="w-[60%] ml-2 font-semibold text-sm flex items-center">{recibo?.InvoiceLine?.Price?.PriceAmount?.toString()}</span>
              </p>
              <p className="w-full flex">
                <span className="w-[40%] flex justify-between">
                  <span>Retención ({recibo?.InvoiceLine?.TaxTotal?.TaxSubtotal?.Percent?.toString()}%) IR</span>
                  <span>:</span>
                </span>
                <span className="w-[60%] ml-2 font-semibold text-sm flex items-center">{recibo?.InvoiceLine?.TaxTotal?.TaxAmount.toString()}</span>
              </p>
              <p className="w-full flex">
                <span className="w-[40%] flex justify-between">
                  <span>Total Neto Recibido</span>
                  <span>:</span>
                </span>
                <span className="w-[60%] ml-2 font-semibold text-sm flex items-center">{recibo?.LegalMonetaryTotal?.PayableAmount.toString()} SOLES</span>
              </p>
              <p className="w-full flex">
                <span className="w-[40%] flex justify-between">
                  <span>Fecha de Emision</span>
                  <span>:</span>
                </span>
                <span className="w-[60%] ml-2 font-semibold text-sm flex items-center">{recibo?.OrderReference?.DocumentReference?.IssueDate?.toString()}</span>
              </p>
            </div>
            {/* <div className="flex-1" >
              <div className="text-center font-semibold">
                <p>Forma de Pago : {}</p>
              </div>
            </div> */}
          </div>
        </div>
        <Tabs information={[
        {
          title: 'Informacion del Emisor',
          description: JSON.stringify(informationUsers.emisor, null, 2)
        },
        {
          title: 'Informacion del Adquirente',
          description: JSON.stringify(informationUsers.adquirente, null, 2)
        }
      ]} />
      </div>
    </>
  )
}
