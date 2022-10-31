

export const exoneracionRetension = async (ruc:string):Promise<{ responde:boolean,info:any }> => {
  const backendAPI = import.meta.env.VITE_BACKEND_API
  const response = await fetch(`${backendAPI}/exoneracion-retraccion/${ruc}`,{
    method:'GET',
    headers:{
      'Content-Type':'application/json'
    }
  })
  const payload = await response.json()
  return payload as { responde:boolean,info:any }
}
