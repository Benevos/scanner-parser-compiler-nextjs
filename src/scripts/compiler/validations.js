export function isSemicolon(token)
{
    if(token === undefined) return false;

    if(token.type !== 'PUNCTUATOR' || token.value !== ';')
    {
        return false;
    }

    return true;
}

export function isKeyword(token)
{
    if(token === undefined) return false;

    if(token.type === 'KEYWORD')
    {
        return true;
    }

    return false;
}

export function isAnyType(token)
{
    if(token === undefined) return false;

    if(token.value === 'Entero' || token.value === 'Decimal' || token.value === 'Cadena')
    {
        return true;
    }

    return false;
}

export function isVariable(token)
{
    if(token === undefined) return false;

    if(token.type !== 'IDENTIFIER')
    {
        return false;
    }

    return true;
}

export function isAssignEqualSymbol(token)
{
    if(token === undefined) return false;

    if(token.type !== 'ASSIGN' || token.value !== '=')
    {
        return false;
    }

    return true;
}

export function isOperator(token)
{
    if(token === undefined) return false;

    if(token.type !== 'OPERATOR')
    {
        return false;
    }

    return true;
}

export function variableExistsAndMatchesType(token, variables, type)
{
    if(token === undefined) return false;

    for (let i = 0; i < variables.length; i++) 
    {
        if(variables[i].identifier === token.value && variables[i].type === type)
        {
            return true;
        }                        
    }

    return false;
}

export function isInitialParenthesis(token)
{
    if(token === undefined) return false;

    if(token.type !== "INITIAL_PUNCTUATOR" || token.value !== "(")
    {
        return false;
    }

    return true;
}

export function isFinalParenthesis(token)
{
    if(token === undefined) return false;

    if(token.type !== "FINAL_PUNCTUATOR" || token.value !== ")")
    {
        return false;
    }

    return true;
}

export function isComma(token)
{
    if(token === undefined) return false;

    if(token.type == "PUNCTUATOR" && token.value == ",")
    {
        return true;
    }

    return false;
}

export function isColon(token)
{
    if(token === undefined) return false;

    if(token.type == "PUNCTUATOR" && token.value == ":")
    {
        return true;
    }

    return false;
}

export function variableExists(token, variables)
{
    if(token === undefined) return false;

    for (let i = 0; i < variables.length; i++) 
    {
        if(variables[i].identifier === token.value)
        {
            return true;
        }                        
    }

    return false;
}

export function isAnyData(token)
{
    if(token === undefined) return false;
    
    if(token.type == "STRING" || token.type == "INTEGER" || token.type == "DECIMAL")
    {
        return true;
    }

    return false;
}