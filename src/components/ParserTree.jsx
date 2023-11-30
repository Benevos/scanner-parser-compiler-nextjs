"use client";

import React, { useState, useEffect } from 'react'
import generateTree from '@/scripts/tree.js';
import getPolishNotation from '@/scripts/lexical_analyzer/polish_notation.js';
import { v4 } from 'uuid';

function ParserTree({ tokens }) 
{
    const [nodes, setNodes] = useState([]);
    const [treeHeight, setTreeHeight] = useState(30);

    const validTypes = ['IDENTIFIER', 'ASSIGN', 'INTEGER', 'DECIMAL', 'OPERATOR'];

    const generateTreeUI = async () =>
    {
        const tokenTree = await generateTree(tokens);
        const polishNotation = await getPolishNotation(tokenTree);

        const tempNodes = await createTreeNode(polishNotation);

        setNodes(tempNodes);
    }

    const isRoot = async (symbol) =>
    {
        let result = false;

        const possibleRoots = ['+','-','=','*','/'];

        for (let i = 0; i < possibleRoots.length; i++) 
        {
            if(possibleRoots[i] === symbol)
            {
            result = true
            break;
            }
        }

        return result;
    }

    const createTreeNode = async (polishNotation) =>
    {
        const treeNodes = [];
        
        let parentChildQueue = [];
        let upperRoot = false;

        const position = 'absolute';
        let marginLeft = window.innerWidth/2-50;
        let marginTop = 20;
        let color = 'red';

        let fisrtNodeTop = 0;
        let lastNodeTop = 0;

        for(let i = 0; i < polishNotation.length; i++)
        {
            const previousIsRoot = polishNotation[i - 1] === null || undefined ? true : await isRoot(polishNotation[i - 1]);
            const currentIsRoot = polishNotation[i - 1] === null ? true : await isRoot(polishNotation[i]);
            const nextIsRoot = polishNotation[i + 1] === null || undefined ? false : await isRoot(polishNotation[i + 1]);

            const isRootAndNotRoot = previousIsRoot && !currentIsRoot;
            const isRootAndRoot = previousIsRoot && currentIsRoot;
            const isNotRootAndRoot =!previousIsRoot && currentIsRoot;
            const isNotRootAndNotRoot = !previousIsRoot && !currentIsRoot

            let hrLeft = marginLeft;
            let hrTop = marginTop;
            let hrWidth = '36px';

            if(isRootAndNotRoot)
            {
                marginTop += 50;
                marginLeft -= 50;

                hrLeft = marginLeft + 15;
                hrTop = marginTop - 15;
            }

            if(isRootAndRoot)
            {
                marginTop += 50;
                marginLeft -= 50;

                hrLeft = marginLeft + 15;
                hrTop = marginTop - 15;
            }

            if(isNotRootAndRoot)
            {
                polishNotation[i-1] === undefined ? null : marginLeft += 100

                hrLeft = marginLeft - 30;
                hrTop = marginTop - 15;
            }

            if(isNotRootAndNotRoot)
            {
                marginLeft += 100;

                hrLeft = marginLeft - 30;
                hrTop = marginTop - 15;
            }

            if(upperRoot)
            {
                console.log(parentChildQueue)
                const [parentLeft, parentTop, symbol] = parentChildQueue[parentChildQueue.length-1];
                
                hrLeft = (parentLeft+marginLeft)/2;
                hrTop = (parentTop+marginTop)/2
                
                parentChildQueue.pop()

                upperRoot = false
            }

            if(isRootAndNotRoot)
            {
                treeNodes.push(<div key={v4()} style={{position, marginLeft, marginTop, color}}>{polishNotation[i]}</div>);
                treeNodes.push(<hr key={v4()} className='-rotate-45 w-8 border-2' style={{position, width: hrWidth, marginLeft: hrLeft, marginTop: hrTop, color}}/>)
            }

            if(isRootAndRoot)
            {
                treeNodes.push(<div key={v4()} style={{position, marginLeft, marginTop, color}}>{polishNotation[i]}</div>)
                treeNodes.push(<hr key={v4()} className='rotate-135 border-2' style={{position, width: hrWidth, marginLeft: hrLeft, marginTop: hrTop, color}}/>)
            }

            if(isNotRootAndRoot)
            {
                treeNodes.push(<div key={v4()} style={{position, marginLeft, marginTop, color}}>{polishNotation[i]}</div>);
                polishNotation[i-1] === undefined ? null : treeNodes.push(<hr key={v4()} className='rotate-45 border-2' style={{position, width: hrWidth, marginLeft: hrLeft, marginTop: hrTop, color}}/>)
            }

            if(isNotRootAndNotRoot)
            {
                treeNodes.push(<div key={v4()} style={{position, marginLeft, marginTop, color}}>{polishNotation[i]}</div>);
                treeNodes.push(<hr key={v4()} className='rotate-45 border-2' style={{position, width: hrWidth, marginLeft: hrLeft, marginTop: hrTop, color}}/>)
                upperRoot = true;
            }

            if(currentIsRoot && nextIsRoot)
            {
                parentChildQueue.push([marginLeft, marginTop, polishNotation[i]])
            }

            if(i === 0)
            {
                fisrtNodeTop = marginTop;
            }
            else if(i === polishNotation.length - 1)
            {
                lastNodeTop = marginTop;
            }
        }

        const treeDivHeight = lastNodeTop - fisrtNodeTop + 50;
        setTreeHeight(treeDivHeight);

        return treeNodes;
    }

    const onlyUnique = (value, index, array) => 
    {
        return array.indexOf(value) === index;
    }

    useEffect(() =>
    {
        const invalidTokens = tokens.filter(token => !validTypes.includes(token.type))

        const typeArray = tokens.map(token => token.type);
        const uniqueTypes = typeArray.filter(onlyUnique);

        let isValid = false;

        if(invalidTokens.length <= 0)
        {
            isValid = true;
        }
  
        if(tokens.length !== 0 && isValid)
        {
            generateTreeUI();
        }
    }, [tokens])

    return (
        <div className='w-full' style={{height: treeHeight}}>
            {nodes.length === 0 ? <div className='w-full flex justify-center'><h1 className='text-red-500'>No hay elementos validos para el árbol</h1></div> : nodes}
        </div>
    )
}

export default ParserTree