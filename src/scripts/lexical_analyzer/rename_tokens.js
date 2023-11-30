export default async function renameTokens(tokens)
{
    const identifiers = [];

    const identifierTokens = tokens.filter(token => token.type === 'IDENTIFIER');

    identifierTokens.forEach(identiferToken => 
    {
        if(!identifiers.includes(identiferToken.value))
        {
           identifiers.push(identiferToken.value);
        }    
    });

    identifiers.forEach((identifier, index) =>
    {
       tokens.forEach(token =>
       {
            if(token.value === identifier && token.type === 'IDENTIFIER')
            {
                token.value = 'id'+(index+1);
            }
       }) 
    });

    tokens.forEach(token =>
    {
        if(token.type === 'INTEGER' || token.type === 'DECIMAL')
        {
            token.value = 'num('+token.value+')';
        }
    })

    return tokens;
}