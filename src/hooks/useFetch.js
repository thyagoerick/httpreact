import { useState, useEffect } from "react";


// 4 - custom hook
export const useFetch = (url) => {

    const [data, setData] = useState(null)
    
    // 5 - refatorando post
    const [config, setConfig] = useState(null) //config methos, cabeçalhos
    const [method, setMethod] = useState(null)
    const [callFetch, setCallFetch] = useState(false)

    //6 - loading
    const [loading, setLoading] = useState(false)

    // 7- tratando erros
    const [error, setError] = useState(null)
    
    
    const [productId, setProductId] = useState(null)
 
    const httpConfig = (data, method) => {        
        if(method === "POST"){
         setConfig({
           method,
           headers:{
                "Content-Type": "application/json"
           },
           body: JSON.stringify(data)
           /*
                JSON.stringify(obj): Converte um objeto JavaScript em uma string JSON.
                obj.json(): Converte uma resposta HTTP (do tipo Response) em um objeto JavaScript.
           */
         });
         setMethod(method);     
        }

        if(method === "PUT"){
            setProductId(data?.id)   
            delete data?.id
            setConfig({
              method,
              headers:{
                   "Content-Type": "application/json"
              },
              body: JSON.stringify(data)
              /*
                JSON.stringify(obj): Converte um objeto JavaScript em uma string JSON. Faz o processo de serialização

                obj.json(): Converte uma resposta HTTP (do tipo Response) em um objeto JavaScript. Faz o processo de desserialização
              */
            });
            setMethod(method);  
           }

        if(method === "DELETE"){
            setConfig({
              method,
              headers:{
                   "Content-Type": "application/json"
              },
            // DELETE não precisa passar o body
            });
            setProductId(data)
            setMethod(method);     
        }
    }


    useEffect(() => {
        (async () => {
            // 6 - loading
            setLoading(true)

            try {
                const res = await fetch(url)
                const str4jsonObj = await res.json()
                setData(str4jsonObj)
            } catch (error) {
                console.log(error.message);
                setError("Houve algum erro ao carregar os dados!")
            }

            setLoading(false)
        })();    
    }, [url, callFetch]) // pois se mudar a url vamos querer que o código dentro seja executado novamente
    // callFetch é adicionado pos sempre que ele for alterado o fetch deve ser chamado novamente


    useEffect(()=>{
        
        (async()=>{
            if(method === "POST"){
                let fetchOptions = [url, config]//a ideia é isso ser dinâmico
                const res = await fetch(...fetchOptions)// aqui que o cadastro é efetuado de fato
                const str4jsonObj = await res.json()//obj.json(): Converte uma resposta HTTP (do tipo Response) em um objeto JavaScript.
                setCallFetch(str4jsonObj) 
            } else if(method === "PUT" && productId !==  null){
                let fetchOptions = [`${url}/${productId}`, config]//a ideia é isso ser dinâmico
                const res = await fetch(...fetchOptions)
                const str4jsonObj = await res.json()
                setCallFetch(str4jsonObj)

                setMethod(null)
                setProductId(null)
            }
            else if(method === "DELETE" && productId !==  null){
                let fetchOptions = [`${url}/${productId}`, config]//a ideia é isso ser dinâmico
                const res = await fetch(...fetchOptions)
                const str4jsonObj = await res.json()
                setCallFetch(str4jsonObj)

                setMethod(null)
                setProductId(null)
            }
        })();
    },[config, url, method, productId])



    return { data, httpConfig, loading, error }
}