export async function generateTokens(input)
{

    const keywords = ["Equipo","Cadena","Entero","Decimal","DefinirMatriz","LlenarMatriz",
                    "Inversa","SumaRestaMatriz","INICIO","FIN","Mostrar","Determinante",
                    "FormGeneral","NumAbsoluto","FuncTrigo","Hipotenusa","AreaCuad",
                    "PotenciaRaiz","Redondear","DecHex","Factorial","AnguloVectorial",
                    "Leer", "Diagonal"]

    var tokens = []
    let current = 0

    while (current < input.length) 
    {
        let char = input[current];

        if(char == " ")
        {
            let value = char;
            tokens.push({type: "SPACE", value});
            current++;
            continue;
        }

        if (/[\(\[\{]/.test(char))
        {
            let value = char
            tokens.push({ type: 'INITIAL_PUNCTUATOR', value, description: "Marca el inicio de los parametros"})
            current++;
            continue;
        }

        if (/[\)\]\}]/.test(char))
        {
            let value = char
            tokens.push({ type: 'FINAL_PUNCTUATOR', value, description: "Marca el final de los parámetros"})
            current++;
            continue;
        }

        if (/[\,\;\:]/.test(char))
        {
            let value = char
            tokens.push({ type: 'PUNCTUATOR', value, description: "Se utiliza para separar sentencias o valores"})
            current++;
            continue;
        }

        if (/[\+\-]/.test(char))
        {
            let value = char
            tokens.push({ type: 'OPERATOR', value, description: "Se usa para realizar una operación sobre valores"})
            current++;
            continue;
        }

        if(char === '*' || char === '/')
        {
            let value = char;
            tokens.push({ type: 'OPERATOR', value, description: "Se usa para realizar una operación sobre valores"});
            current++;
            continue;
        }

        if (/[\=]/.test(char))
        {
            let value = char
            tokens.push({ type: 'ASSIGN', value, description: "Asigna el valor retornado por los elementos de la derecha al símbolo de la izquierda"})
            current++;
            continue;
        }

        if (/[a-zA-Z][a-zA-Z0-9]*/.test(char)) 
        {
            let value = '';
            let description = ""
            let type = ""

            while (/[a-zA-Z0-9]/.test(char) && current < input.length) 
            {
              value += char;
              char = input[++current];
            }
            
            for(let i =0; i < keywords.length ; i++)
            {
                if(value == keywords[i])
                {
                    type = "KEYWORD";
                    description = "Palabra reservada para una función con un comportamiento predefinido"
                    break;
                }
                else
                {
                    type = "IDENTIFIER";
                    description = "Guarda un valor dentro de el identificador"
                }
            }
            tokens.push({ type, value, description});
            continue;
        }

        if (/[0-9]+/.test(char))
        {
            let value = "";
            let description = "";
            let type = "";
            let isDecimal = false;

            while (/[0-9]/.test(char) && current < input.length)
            {
                value += char;
                if(!isDecimal)
                {
                    type = "INTEGER";
                    description = "Valor entero";
                }
                if(input[current+1] == "." && Number.isInteger(Number(input[current+2])))
                {
                    value += ".";
                    isDecimal = true;
                    type = "DECIMAL"
                    description = "Valor decimal";
                    current++
                }
                char = input[++current];
            }
            tokens.push({ type, value, description});
            continue;
        }

        if (char === '"' || char === "'") 
        {
            let value = '';
            char = input[++current];

            while (char !== '"' && char !== "'" && current < input.length) 
            {
              value += char;
              char = input[++current];
            }

            tokens.push({ type: 'STRING', value: `"${value}"`, description: "Valor de tipo cadena de texto" });
            current++;
            continue;
        }
        tokens.push({type: "UNKNOWN", value: char, description: "Elemento desconocido"})
        current++;
    }

    tokens = tokens.filter(token => token.type !== "SPACE")
    return tokens;
}