import './App.css';
import 'primeicons/primeicons.css';
import {useState} from 'react';

// 4 - custom hook
import {useFetch} from './hooks/useFetch'



function App() {
  const url = "http://localhost:3000/products"
  //const [products, setProducts] = useState([])  


  // 4- custom hook
  const { data: items, httpConfig, loading, error } = useFetch(url);

  const [nome, setNome] = useState("")
  const [preco, setPreco] = useState("")

  const [productId, setProductId] = useState(null)
  const [editar, setEditar] = useState(false)


  
  const limpar = () => {
    setNome('');
    setPreco('');
  }
  const limparEsair = () =>{
    limpar();
    setEditar(false)
  }

  const deleteProduct = async (id) => {
    httpConfig(id,"DELETE")
    setProductId(null)
  };
  
  const editProduct = async (id) =>{
      setEditar(true)
      setProductId(id)
      const res = await fetch(`${url}/${id}`)
      const productSought = await res.json()
      setNome(productSought?.name)      
      setPreco(productSought?.price)
  }

  // 2 - adição de produtos
  const handleSubmit = async (e) => {
    e.preventDefault();

   const product = {
    ...(editar && { 'id': productId }), // Adiciona o ID apenas se `editar` for true
    name: nome,
    price: preco,
  };

    // const res = await fetch(url, {
    //     method: "POST",
    //     headers:{
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(product),
    // })

    // //3 - carregamento dinâmico
    // const addedProduct = await res.json(); // nesse caso retransforma em um obj js
    // /* 
    //   Ao receber:
    //     .json() é usado pra converter respostas de requisições HTTP.
    //   No envio:
    //     JSON.stringfy e JSON.parse() são usados geralmente quando a gente trabalha com localStorage, onde o primeiro transforma um objeto em json, pode ser usado em requisições também, e o segundo faz o contrário.
    // */
    // setProducts((prevProducts) => [ ...prevProducts, addedProduct])
    

    // 5 - refatorando post
    editar
      ? (()=>{
        httpConfig(product,"PUT")
        setEditar(false)
        })()
      : httpConfig(product,"POST")
      
      limpar();
  } 

  return (
    (<div className="App">
      <nav>
        <img src="logo.png" alt="Imagem de Mercadinho" width={80} height={80}/>
        <h1>CRUD de Produtos</h1>
      </nav>
      <main>
        <div className='add-product'>
          <form onSubmit={handleSubmit}>
            <label>
              Produto:
              <input type="text" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} required/>
            </label>
            <label>
              Preço:
              <input type="number" name="preco" value={preco} onChange={(e) => setPreco(e.target.value)} required/>
            </label>
            { loading
                ? (<button disabled>
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.8rem' }}></i>
                  </button>)
                : editar 
                    ? (<>
                      <input type="submit" value="EDITAR"/>
                      <button onClick={()=>limparEsair()}>CANCELAR</button>
                    </>)
                    : (<>
                      <input type="submit" value="CADASTRAR"/>
                      <h4 className='qtdProdutos'>{items?.length} produtos cadastrados</h4>
                    </>)
            }         
          </form>
        </div>

        <div className='table-products'>
          <div className="table-border">
            <table>   
              <thead>
                <tr>
                  <th scope="col">Produto</th>
                  <th scope="col">Preço</th>
                  <th scope="col">Editar</th>
                  <th scope="col">Deletar</th>
                </tr>
              </thead>
              <tbody>
                {loading &&(
                  <tr>
                    <td colSpan={4}>
                      <span style={{display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'center', padding:10, gap:15}}>
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                        <p>Carregando...</p>
                      </span>
                    </td> 
                  </tr>
                )}
                {
                  error && (
                    <tr>
                      <td colSpan={4}>
                        <span style={{display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'center', padding:10, gap:15}}>
                          <p>{error}</p>
                        </span>
                      </td> 
                    </tr>
                  )
                }

                {!error && (items && items.map((p) => ( // items &&  -> essa parte faz com que só itere o com o map se existir itens
                  (<tr key={p.id}>
                    <td>{p.name}</td>
                    <td>R${Number(p.price).toFixed(2).replace('.', ',')}</td>
                    <td>
                      <span>
                        <button className='edit' title='Editar Produto' onClick={()=> {
                            editProduct(p.id)
                          }}>
                          <i className="pi pi-pencil" style={{ fontSize: '1.5rem' }}></i>
                        </button>
                      </span>
                    </td>
                    <td>
                      <span>
                        <button className='delete' title='Deletar Produto' onClick={() => {
                            deleteProduct(p.id)
                          }}>
                          <i className="pi pi-trash" style={{ fontSize: '1.5rem' }}></i>
                        </button>
                      </span>
                    </td>
                  </tr>)
                )))}
              </tbody>
            </table>
          </div>
          <span className='aviso-de-scroll' title='A tabela torna-se scrollável, a partir de 5 itens!'>
            <i className="pi pi-angle-double-up
  " style={{ fontSize: '1.5rem' }}></i>
            <i className="pi pi-angle-double-down" style={{ fontSize: '1.5rem' }}></i>
          </span>
        </div>
      </main>
    </div>)
  );
}

export default App;
