"use client";

import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header.jsx'
import { generateTokens } from '@/scripts/lexical_analyzer/generate_tokens.js';
import renameTokens from '@/scripts/lexical_analyzer/rename_tokens.js';
import ParserTree from '@/components/ParserTree.jsx';
import ScannerResult from '@/components/ScannerResult.jsx';
import Link from 'next/link.js';
import Semantic from '@/components/Semantic.jsx';
import Script from 'next/script';
import compiler from '@/scripts/compiler/compiler.js';
import { Editor } from '@monaco-editor/react';

export default function Home() 
{
  const [input, setInput] = useState('');
  const [tokens, setTokens] = useState([]);
  const [isValidForTree, setIsValidForTree] = useState(false);
  const [pythonCode, setPythonCode] = useState('');

  const editorRef = useRef(null);

  const validTypes = ['IDENTIFIER', 'ASSIGN', 'INTEGER', 'DECIMAL', 'OPERATOR'];

  const handleEditorDidMount = (editor, monaco) =>
  {
    editorRef.current = editor;
  }

  const handleChange = ({ target: { value } }) =>
  {
    setInput(value)
  }

  const handleClick = async () =>
  {
    
    const tokens = await generateTokens(input.replace('\n', ' '));
    const cleanedTokens = tokens.filter(token => !(token.value === '\n' && token.type === 'UNKNOWN'));
    await renameTokens(cleanedTokens);
    setTokens(cleanedTokens);

    const compilerTokens = await generateTokens(input.replace('\n', ' '));
    const cleanedCompilerTokens = compilerTokens.filter(token => !(token.value === '\n' && token.type === 'UNKNOWN'));

    //try
    //{
      console.clear();
      console.log(cleanedCompilerTokens)

 
        const code = await compiler(cleanedCompilerTokens);

        const refactoredCode = code.join('\n');

        setPythonCode(refactoredCode);    
      
  }

  const handleDownload = async () =>
  {
      const link = document.createElement("a");
      const file = new Blob([pythonCode+'\ninput("\\nPresione la tecla ENTER para finalizar...")'], { type: 'text/plain' });
      link.href = URL.createObjectURL(file);
      link.download = "codigo-compilado.py";  
      link.click();    
      URL.revokeObjectURL(link.href);
  }

  const handleEditorChange = () =>
  {
    console.log(editorRef.current.getValue());
    setPythonCode(editorRef.current.getValue());
  }

  useEffect(() =>
  {
      const invalidTokens = tokens.filter(token => !validTypes.includes(token.type))
      
      if(invalidTokens.length <= 0 && tokens.length !== 0)
      {
        setIsValidForTree(true);
      }
      else
      {
        setIsValidForTree(false);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens])

  return (
    <div className='h-full flex flex-col items-center'>
      <Script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"/>
      <Header/>

      <div className='w-11/12 max-md:w-full mt-2 rounded-md flex flex-col items-center bg-slate-400 px-3 py-3 shadow-2xl'>

          <div className='py-3 w-full flex flex-col items-center'>
            <h1 className='text-2xl font-semibold pb-2'>Analizador léxico</h1>
            <hr className='w-full'/>
          </div>

          <div className='flex flex-col items-center w-full'>
            <label className='mb-2'l>Ingrese instrucciones:</label>
            <textarea onChange={handleChange} className='w-8/12 h-28 px-2 text-lg resize-y max-md:w-11/12' placeholder='Instrucciones...'/>
            <div className='mt-2 text-xs'>
              <label>Manual de instrucciones:</label> <Link className='underline text-blue-600 hover:text-blue-800 visited:text-purple-600' target='_blank' href={'/PSB_8E_Benevos_Instrucciones.pdf'}>haga clic aqui</Link>
            </div>
            <button onClick={handleClick} className='bg-slate-200 px-2 py-1 w-3/12 mt-2 border-slate-700 hover:bg-slate-50'>Iniciar</button>
          </div>

          <ScannerResult tokens={tokens}/>

          <div className='py-3 mt-3 w-full flex flex-col items-center'>
            <h1 className='text-2xl font-semibold pb-2'>Analizador sintactico</h1>
            <hr className='w-full'/>
          </div>
          
          {isValidForTree === true ? <ParserTree tokens={tokens}/> : <h1 className='text-red-500'>No hay elementos validos para el árbol</h1>}

          <Semantic tokens={tokens}/> 
          

          <div className='my-5 w-full flex flex-col items-center'>
            <div className='py-3 mt-3 w-full flex flex-col items-center'>
                <h1 className='text-2xl font-semibold pb-2'>Código compilado</h1>
                <hr className='w-full'/>
            </div>

            <Editor 
              onMount={handleEditorDidMount} 
              onChange={handleEditorChange}
              theme='vs-dark' 
              language='python' 
              value={pythonCode}
              height={'300px'} 
              options={{readOnly: false, fontSize: 20}}/>

            <button onClick={handleDownload} className='bg-slate-200 px-2 py-1 w-3/12 mt-2 border-slate-700 hover:bg-slate-50'>Guardar ejecutable</button>
          </div>
      </div>
    </div>
  )
}
