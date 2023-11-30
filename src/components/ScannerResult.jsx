import React, { useEffect, useState } from 'react'
 
function ScannerResult({ tokens }) 
{
  const [tokenValues, setTokenValues] = useState([]);
  
  useEffect(() =>
  {
    setTokenValues(tokens.map(token => token.value));
  }, [tokens]) 

  return (
    <>
      <div className='py-3 w-full flex flex-col items-center'>
        <h1 className='text-2xl font-semibold pb-2'>Resultado de escaneo:</h1>
      </div>

      <p className='mb-5 text-red-500 font-bold text-xl text-center max-md:text-lg'>{tokenValues.join(' ')}</p>
    
      <div className='grid grid-cols-layout max-md:grid-cols-4 max-h-96 overflow-x-auto overflow-y-auto'>
          <div className='text-xl font-semibold px-4 bg-slate-700 text-slate-100 flex justify-center items-center'>Posición</div>
          <div className='text-xl font-semibold bg-slate-700 text-slate-100 flex justify-center items-center'>Símbolo</div>
          <div className='text-xl font-semibold pl-4 bg-slate-700 text-slate-100 flex justify-center items-center'>Tipo</div>
          <div className='text-xl font-semibold bg-slate-700 text-slate-100 flex justify-center items-center'>Descripción</div>

          {tokens.map((token, index) =>
              {
                let color = index % 2 === 0 ? 'bg-slate-500' : 'bg-slate-600' 

                let type = token.type === 'IDENTIFIER' ? 'IDENTIFICADOR' : token.type === 'OPERATOR' ? 'OPERADOR' : token.type === 'ASSIGN' ? 'ASIGNACIÓN' : token.type === 'INTEGER' ? 'ENTERO': token.type === 'DECIMAL' ? 'DECIMAL' : token.type === 'KEYWORD' ? 'PALABRA CLAVE' : token.type === 'STRING' ? 'CADENA' : token.type === 'PUNCTUATOR' ? 'PUNTUADOR' : token.type === 'INITIAL_PUNCTUATOR' ? 'PUNTUADOR' : token.type === 'FINAL_PUNCTUATOR' ? 'PUNTUADOR' : 'DESCONOCIDO';

                return(
                    <React.Fragment key={'row'+index}>
                    <div className={'flex text-xl justify-center items-center font-semibold text-green-500 '+color}>{index+1}</div>
                    <div className={'flex text-xl justify-center items-center font-bold text-slate-100 '+color}>{token.value}</div>
                    <div className={'flex text-xl justify-center px-4 items-center font-semibold text-red-600 '+color}>{type}</div>
                    <div className={'text-justify text-xl overflow-auto text-slate-100 py-2 px-3 '+color}>{token.description}</div>
                    </React.Fragment>
                  )
              }
          )}
      </div>
    </>
  )
}

export default ScannerResult