import './App.css';
import 'primeicons/primeicons.css';

import {useState, useEffect} from 'react';

function App() {
  const url = "http://localhost:3000/products"
  const [products, setProducts] = useState([])

  const [nome, setNome] = useState("")
  const [preco, setPreco] = useState("")

  // - 1 resgatando dados
  useEffect(() => {async function fetchData() {
      const res = await fetch(url)// resposta em json, texto puro
      const data = await res.json() // converte pra objeto para permitir iteração em lista
      setProducts(data)
    }
    fetchData();
  },[])

// 2 - adição de produtos
const handleSubmit = (e) => {
} 

  return (
    <div className="App">
     
      <nav>
        <img src="logo.png" alt="Imagem de Mercadinho" width={80} height={80}/>
        <h1>CRUD de Produtos</h1>
      </nav>

      <main>
        <div className='add-product'>
          <form onSubmit={handleSubmit}>
            <label>
              Produto:
              <input type="text" name="nome" value={nome} onChange={(e) => setNome(e.target.value)}/>
            </label>
            <label>
              Preço:
              <input type="number" name="preco" value={preco} onChange={(e) => setPreco(e.target.value)} min="0"/>
            </label>
            <input type="submit" value="CADASTRAR" />
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
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>R${Number(p.price).toFixed(2).replace('.', ',')}</td>
                    <td>
                      <button className='edit' title='Editar Produto'>
                        <i className="pi pi-pencil" style={{ fontSize: '1.5rem' }}></i>
                      </button>
                    </td>
                    <td>
                      <button className='delete' title='Deletar Produto'>
                        <i className="pi pi-trash" style={{ fontSize: '1.5rem' }}></i>
                      </button>
                    </td>
                  </tr>
                ))}
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
    </div>
  );
}

export default App;
