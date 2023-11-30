import util from 'util'
import { generateTokens } from "./lexical_analyzer/generate_tokens.js";
import renameTokens from './lexical_analyzer/rename_tokens.js';

export async function searchRoot(tokens)
{   
    let root = null;
    let index = null;
    let symbolFound = false;

    const tokensLength = tokens.length 

    while(!symbolFound)
    {
        for(let i = tokensLength - 1; i >= 0; i--)
        {
            if(tokens[i].value === '=' && tokens[i].type === 'ASSIGN')
            {
                root = tokens[i].value;
                index = i;
                symbolFound = true;
                break;
            }
        }

        if(symbolFound) break

        for(let i = tokensLength - 1; i >= 0; i--)
        {
            if((tokens[i].value === '+' || tokens[i].value === '-') && tokens[i].type === 'OPERATOR')
            {
                root = tokens[i].value;
                index = i;
                symbolFound = true;
                break;
            }
        }

        if(symbolFound) break

        for(let i = tokensLength - 1; i >= 0; i--)
        {
            if((tokens[i].value === '*' || tokens[i].value === '/') && tokens[i].type === 'OPERATOR')
            {
                root = tokens[i].value;
                index = i;
                symbolFound = true;
                break;
            }
        }

        if(symbolFound) break

        for(let i = tokensLength - 1; i >= 0; i--)
        {
            if(tokens[i].type === 'IDENTIFIER' || tokens[i].value === 'INTEGER' || tokens[i].value === 'DECIMAL')
            {
                root = tokens[i].value;
                index = i;
                symbolFound = true;
                break;
            }
        }

        if(symbolFound) break
    }

    return [root, index];
}

export default async function generateTree(tokens)
{
    const node = {
        root: null,
        left: null,
        right: null
    }

    const [symbol, index] = await searchRoot(tokens);
    const left = tokens.slice(0, index);
    const right = tokens.slice(index + 1, tokens.length);

    if(left.length === 0 || right.length === 0)
    {
        throw new Error('All parents must have at least 2 children');
    }

    node.root = symbol;
    node.left = left;
    node.right = right;

    if(left.length !== 1)
    {
        node.left = await generateTree(node.left)
    }
    else
    {
        node.left = left[0].value;
    }

    if(right.length !== 1)
    {
        node.right = await generateTree(node.right)
    }
    else
    {
        node.right = right[0].value;
    }

    return node;
}




