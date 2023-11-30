export function determineCurrentType(token)
{
    let currentType;

    if(token.value === 'Entero')
    {
        currentType = 'INTEGER'
    }

    else if(token.value === 'Cadena')
    {
        currentType = 'STRING'
    }

    else if(token.value === 'Decimal')
    {
        currentType = 'DECIMAL'
    }

    else
    {
        throw new Error('No type known');
    }

    return currentType;
}

export function getVariableType(identifier, variables)
{
    for (let i = 0; i < variables.length; i++) 
    {
        if(variables[i].identifier === identifier)
        {
            return variables[i].type;
        }                        
    }

    return undefined;
}

export function getVariableReferenceValue(reference, variables)
{
    let value = null;

    let searchReference = reference;

    let referenceFound = true;

    while(referenceFound)
    {
        for(let i = 0; i < variables.length; i++)
        {
            if(variables[i].identifier === searchReference && variables[i].reference !== null)
            {
                searchReference = variables[i].identifier;
            }
            else if(variables[i].identifier === searchReference && variables[i].reference === null)
            {
                value = variables[i].value;
                referenceFound = false;
                break;
            }
        }
    }

    return value;
}

export function getVariableValueOrReference(variable)
{
    if(variable.reference === null)
    {
        return variable.value;
    }

    return variable.reference;
}

export function getVariable(identifier)
{
    for (let i = 0; i < variables.length; i++) 
    {
        if(variables[i].identifier === identifier)
        {
            return variables[i];
        }                        
    }

    return undefined;
}