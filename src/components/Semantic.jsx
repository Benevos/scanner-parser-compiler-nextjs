'use client';
import generateSemanticData from '@/scripts/generate_semantic';
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { FaLongArrowAltRight } from 'react-icons/fa'

function Semantic({ tokens })
{
    const [semanticTokens, setSemamticTokens] = useState([]);

    const mathJaxReanalyze = async () => 
    {
        if (typeof window !== 'undefined' && window.MathJax) 
        {
            try
            {
                await window.MathJax.typesetPromise();//
            }
            catch(e)
            {
                console.log("MatJax error: " + e);
            }
        }
    }

    const getUniqueTypes = async () =>
    {
        const semanticData = await generateSemanticData(tokens);
        setSemamticTokens(semanticData);
    }   

    useEffect(() => 
    {
        if(tokens.length !== 0)
        {
            getUniqueTypes();
        }
    }, [tokens]);

    useEffect(() =>
    {
        mathJaxReanalyze();
    }, [semanticTokens])
    
    return (
        <>
            <div className='py-3 mt-3 w-full flex flex-col items-center'>
                <h1 className='text-2xl font-semibold pb-2'>Analizador semántico</h1>
                <hr className='w-full'/>
            </div>

            <div className='w-full flex flex-col items-center justify-center'>
                <p className='text-red-600 font-semibold mb-1'>ADVERTENCIA</p>

                <p className='font-semibold text-center w-10/12 mb-3'>El analisís semántico esta diseñado para funcionar con pantallas de 1360px de ancho, si su ventana mide menos que eso, es posible que vea saltos de linea donde no deberia</p>
            </div>

            { 
            semanticTokens.length === 0 ? <div className='text-red-500'><h1>Sin elementos para analizar</h1></div> :
                <div className='overflow-y-auto w-full px-20'>
                   <div className='grid grid-cols-3'>
                    {
                        semanticTokens.map(token =>
                        <React.Fragment key={v4()}>
                            <div className='font-bold text-red-600'>
                                <p>{token.left}</p>
                            </div>
                            <div className='font-bold'>
                                <FaLongArrowAltRight/>
                            </div>
                            <div className='font-bold'>
                                <p>{token.right}</p>
                            </div>
                        </React.Fragment>) 
                    }
                    </div>
                </div>
            }
            
        </>
    );
}

export default Semantic;