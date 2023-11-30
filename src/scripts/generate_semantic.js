const onlyUnique = (value, index, array) => 
{
    return array.indexOf(value) === index;
}

export default async function generateSemanticData(tokens = [])
{   
    const semanticData = [];

    const keywordTokens = tokens.filter(token => token.type === 'KEYWORD');
    const keywords = keywordTokens.map(keywordToken => keywordToken.value);
    const uniqueKeywords = keywords.filter(onlyUnique);

    if(uniqueKeywords.length > 0)
    {
        let datoRequired = false;
        let trigoRequired = false;
        let enteroRequired = false;
        let cadRequired = false;
        let tipoRequired = false;
    
        semanticData.push(
            {left: 'prog', right: 'INICIO \\(inst^*\\) FIN'},
            {left: 'inst', right: '(prop || exp) ;'},
        );

        if(uniqueKeywords.includes('Equipo'))
        {
            semanticData.push(
                {left: 'inst', right: 'Equipo ;'}
            )
        }

        if(uniqueKeywords.includes('Cadena') || uniqueKeywords.includes('Entero') || uniqueKeywords.includes('Decimal') || uniqueKeywords.includes('DefinirMatriz'))
        {
            cadRequired = true;
            enteroRequired = true;
            tipoRequired = true;
            
            semanticData.push(
                {left: 'inst', right: 'decl ;'},
            );
        }

        if(uniqueKeywords.includes('Cadena') || uniqueKeywords.includes('Entero') || uniqueKeywords.includes('Decimal'))
        {
            cadRequired = true;
            enteroRequired = true;
            tipoRequired = true;

            semanticData.push(
                {left: 'decl', right: 'tipo id = (cad || entero || num)'},
            );
        }


        if(uniqueKeywords.includes('DefinirMatriz'))
        {
            tipoRequired = true;
            enteroRequired = true;

            semanticData.push(
                {left: 'decl', right: 'DefinirMatriz tipo \\([ \\; (id \\; || \\; entero) \\; ]^+\\) '},
            );
        }

        semanticData.push(
            {left: 'prop', right: 'id = exp'},
        );

        if(uniqueKeywords.includes('Leer'))
        {
            semanticData.push(
                {left: 'prop', right: 'id = Leer'}
            );
        }

        semanticData.push(
            {left: 'exp', right: 'id || num || exp \\(oper^+\\)'},
            {left: 'oper', right: '+ exp || * exp || / exp'},
        );
        

        if(uniqueKeywords.includes('LlenarMatriz') || uniqueKeywords.includes('SumaRestaMatriz') || uniqueKeywords.includes('Mostrar') || uniqueKeywords.includes('DecHex') || uniqueKeywords.includes('Factorial') || uniqueKeywords.includes('Inversa') || uniqueKeywords.includes('Diagonal') || uniqueKeywords.includes('Determinante') || uniqueKeywords.includes('FormGeneral') || uniqueKeywords.includes('NumAbsoluto') || uniqueKeywords.includes('FuncTrigo') || uniqueKeywords.includes('Hipotenusa') || uniqueKeywords.includes('AreaCuad') || uniqueKeywords.includes('PotenciaRaiz') || uniqueKeywords.includes('Redondear') || uniqueKeywords.includes('AnguloVectorial'))
        {
            semanticData.push(
                {left: 'prop', right: 'id = func'},
            );
        }
        
        if(uniqueKeywords.includes('LlenarMatriz'))
        {
            datoRequired = true;

            semanticData.push(
                
                {left: 'func', right: '\\(LlenarMatriz \\; ( \\; dato \\; (, \\; dato)^+ \\; (: \\; dato \\; (, \\; dato)^+)^+ \\; )\\)'},
            );
        }

        if(uniqueKeywords.includes('SumaRestaMatriz'))
        {
            semanticData.push(
                
                {left: 'func', right: 'SumaRestaMatriz ( id (+ || -) id )'},
            );
        }

        if(uniqueKeywords.includes('Mostrar'))
        {
            datoRequired = true;

            semanticData.push(
                
                {left: 'func', right: 'Mostrar ( dato )'},
            );
        }

        if(uniqueKeywords.includes('DecHex'))
        {
            enteroRequired = true;
            cadRequired = true;
            
            semanticData.push(
                
                {left: 'func', right: 'Redondear ( entero || cad )'},
            );
        }

        if(uniqueKeywords.includes('Factorial'))
        {
            enteroRequired = true;

            semanticData.push(
                
                {left: 'func', right: 'NumAbsoluto ( (id || entero) )'},
            );
        }

        if(uniqueKeywords.includes('Inversa') )
        {
            semanticData.push(
                
                {left: 'func', right: 'Inversa ( id )'},
            );
        }

        if(uniqueKeywords.includes('Diagonal') )
        {
            semanticData.push(
                
                {left: 'func', right: 'Diagonal ( id )'},
            );
        }

        if(uniqueKeywords.includes('Determinante') )
        {
            semanticData.push(
                
                {left: 'func', right: 'Determinante ( id )'},
            );
        }        

        if(uniqueKeywords.includes('FormGeneral'))
        {
            semanticData.push(
                
                {left: 'func', right: 'FormGeneral ( (id || num) , (id || num) , (id || num) )'},
            );
        }

        if(uniqueKeywords.includes('NumAbsoluto'))
        {
            semanticData.push(
                
                {left: 'func', right: 'NumAbsoluto ( (id || num) )'},
            );
        }

        if(uniqueKeywords.includes('FuncTrigo'))
        {
            trigoRequired = true;

            semanticData.push(
                
                {left: 'func', right: 'FuncTrigo ( trigo , (id || num) )'},
            );
        }

        if(uniqueKeywords.includes('Hipotenusa'))
        {
            semanticData.push(
                
                {left: 'func', right: 'Hipotenusa ( (id || num) , (id || num) )'},
            );
        }

        if(uniqueKeywords.includes('AreaCuad'))
        {
            semanticData.push(
                
                {left: 'func', right: 'Hipotenusa ( (0 || 1 || 2 || 3) , (id || num) , (id || num) )'},
            );
        }

        if(uniqueKeywords.includes('PotenciaRaiz')) //
        {
            semanticData.push(
                
                {left: 'func', right: 'PotenciaRaiz ( (0 || 1) , (id || num) , (id || num) )'},
            );
        }

        if(uniqueKeywords.includes('Redondear'))
        {
            semanticData.push(
                
                {left: 'func', right: 'Redondear ( (0 || 1) , (id || num) )'},
            );
        }

        if(uniqueKeywords.includes('AnguloVectorial'))
        {
            semanticData.push(
                
                {left: 'func', right: 'AnguloVectorial ( (id || num) , (id || num) )'},
            );
        }

        if(tipoRequired)
        {
            semanticData.push(
                {left: 'tipo', right: 'Cadena || Entero || Decimal'}
            )
        }

        if(datoRequired)
        {
            cadRequired = true;
            
            semanticData.push(
                {left: 'dato', right: 'id || num || cad'},
            );
        }

        if(cadRequired)
        {
            semanticData.push(
                {left: 'cad', right: '" let \\((num \\; || \\; let)^?\\) "'}
            );
        }

        if(trigoRequired)
        {
            semanticData.push(
                {left: 'trigo', right: '"sen" || "cos" || "tan" || "sec" || "csc" || "cot"'}
            );
        }

        if(enteroRequired)
        {
            semanticData.push(
                {left: 'entero', right: '\\((0-9)^+\\)'}
            )
        }

        semanticData.push(
            {left: 'id', right: 'let \\((num \\; || \\; let)^?\\)'},
            {left: 'let', right: 'A-Z || a-z'},
            {left: 'num', right: '\\(dig^+\\) || \\(dig^+\\) . \\(dig^+\\)'},
            {left: 'dig', right: '0-9'}
        );

        return semanticData;
    }
    
    const types = tokens.map(token => token.type);
    const uniqueTypes = types.filter(onlyUnique);

    if(uniqueTypes.includes('ASSIGN'))
    {
        semanticData.push(
            {left: 'prop', right: 'id = exp'},
            {left: 'exp', right: 'id || num || exp \\(oper^+\\)'},
            {left: 'oper', right: '+ exp || * exp || / exp'},
            {left: 'id', right: 'let \\((num || let)^?\\)'},
            {left: 'let', right: 'A - Z || a - z'},
            {left: 'num', right: '\\(dig^+\\) || \\(dig^+\\) . \\(dig^+\\)'},
            {left: 'dig', right: '0 - 9'}
        );

        return semanticData;
    }

    if(uniqueTypes.includes('OPERATOR'))
    {
        semanticData.push(
            {left: 'exp', right: 'id || num || exp \\(oper^+\\)'},
            {left: 'oper', right: '+ exp || * exp || / exp'},
            {left: 'num', right: '\\(dig^+\\) || \\(dig^+\\) . \\(dig^+\\)'},
            {left: 'let', right: 'A - Z || a - z'},
            {left: 'num', right: '\\(dig^+\\) || \\(dig^+\\) . \\(dig^+\\)'},
            {left: 'dig', right: '0 - 9'}
        )

        return semanticData;
    }

    if(uniqueTypes.includes('IDENTIFIER'))
    {
        semanticData.push(
            {left: 'num', right: '\\(dig^+\\) || \\(dig^+\\) . \\(dig^+\\)'},
            {left: 'let', right: 'A - Z || a - z'},
            {left: 'num', right: '\\(dig^+\\) || \\(dig^+\\) . \\(dig^+\\)'},
            {left: 'dig', right: '0 - 9'},
        );

        return semanticData;
    }

    if(uniqueTypes.includes('INTEGER') || uniqueKeywords.includes('DECIMAL'))
    {
        semanticData.push(
            {left: 'num', right: '\\(dig^+\\) || \\(dig^+\\) . \\(dig^+\\)'},
            {left: 'dig', right: ' 0 - 9'},
        );

        return semanticData;
    }

    return semanticData;
}   