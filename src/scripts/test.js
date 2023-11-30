function getVariableReferenceValue(reference, variables)
{
    let value = null;

    let searchReference = reference;

    let referenceFound = true;

    while(referenceFound)
    {
        for(let i = 0; i < variables.length; i++)
        {
            console.log(i)
            console.log(searchReference, variables[i].identifier, variables[i].reference);

            if(variables[i].identifier === searchReference && variables[i].reference !== null)
            {
                searchReference = variables[i].identifier;
            }
            else if(variables[i].identifier === searchReference && variables[i].reference === null)
            {
                console.log('found')
                value = variables[i].value;
                referenceFound = false;
                break;
            }
        }
    }

    return value;
}

const variables = [
    {identifier: 'foo', reference: null, value: 34},
    {identifier: 'bar', reference: 'foo', value: null},
]

const variable = {identifier: 'bar', reference: 'foo', value: null};

const value = getVariableReferenceValue('foo', variables);

console.log(value)