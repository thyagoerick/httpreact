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

    const httpConfig = (data, method) => {        
        if(method === "POST"){
         setConfig({
           method,
           headers:{
                "Content-Type": "application/json"
           },
           body: JSON.stringify(data)
         });

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
                let fetchOptions = [url, config]//a ideia é isso ser dinâmico (mas aqui só vou usar caso for POST mesmo)

                const res = await fetch(...fetchOptions)
                const str4jsonObj = await res.json()
                setCallFetch(str4jsonObj)
            }
        })();

    },[config, url, method])



    return { data, httpConfig, loading, error }
}