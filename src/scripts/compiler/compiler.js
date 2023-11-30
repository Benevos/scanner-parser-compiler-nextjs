import { determineCurrentType, getVariableType, getVariableReferenceValue, getVariableValueOrReference, getVariable } from "./methods";
import { isAssignEqualSymbol, isKeyword, isVariable, isOperator, isAnyType, isSemicolon, variableExists, variableExistsAndMatchesType, isInitialParenthesis, isAnyData, isFinalParenthesis, isComma, isColon } from "./validations";

async function compiler(tokens = [{value: '', type: ''}])
{
    const code = [];
    const variables = [];   

    let numpyRequired = false;
    let mathRequiered = false;
    let cmathRequired = false;

    if((tokens[0].value === 'INICIO' && isKeyword(tokens[0])))
    {
        const tokenLines= [];
        
        let startLineSilce = 1;
        for(let i = 1; i < tokens.length; i++)
        {
            if(isSemicolon(tokens[i]))
            {
                tokenLines.push(tokens.slice(startLineSilce, i+1));
                startLineSilce = i+1;
            }
        }

        for(let i = 0; i < tokenLines.length; i++)
        {
            let currentToken = 0;

            let tempVariable = {identifier: '', type: '', reference: null, value: null, dimensions: []}

            let tokenLine = tokenLines[i];  
            console.log(tokenLine)

            if(isVariable(tokenLine[currentToken]) && variableExists(tokenLine[currentToken], variables))
            {
                tempVariable.identifier = tokenLine[currentToken].value;
                let currentType = getVariableType(tokenLine[currentToken].value, variables);
                let outputLine = `${tokenLine[currentToken].value}`

                currentToken++;

                if(!isAssignEqualSymbol(tokenLine[currentToken]))
                {
                    //TODO: Write error
                }
                
                outputLine += ' = ';
                currentToken++;

                //? CON ASIGNACION

                //! OPERACIONES ARITMETICAS
                if(tokenLine[currentToken].type === currentType || (isVariable(tokenLine[currentToken]) && variableExistsAndMatchesType(tokenLine[currentToken], variables, currentType)))
                {
                    if(!tokenLine[currentToken].type === currentType)
                    {
                        throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO del mismo tipo, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                    }

                    let identifierToReplace = [];

                    if(!(isVariable(tokenLine[currentToken]) && variableExistsAndMatchesType(tokenLine[currentToken], variables, currentType)))
                    {
                        
                    }
                    else
                    {
                        identifierToReplace.push(tokenLine[currentToken].value);
                    }

                    outputLine += `${tokenLine[currentToken].value}`;
                    currentToken++;

                    while(true)
                    {
                        if(isSemicolon(tokenLine[currentToken]))
                        {
                            console.log('operacion aritmetica')

                            let slicedLine = '';

                            for(let j = 0; j < outputLine.length; j++)
                            {
                                if(outputLine[j] === '=')
                                {
                                    slicedLine = outputLine.slice(j + 1, outputLine.length)
                                }
                            }

                            identifierToReplace.forEach(identifier =>
                            {
                                slicedLine = slicedLine.replace(identifier, getVariableReferenceValue(identifier, variables).toString()); 
                            });

                            for(let j = 0; j < variables.length; j++)
                            {
                                if(tempVariable.identifier === variables[j].identifier)
                                {
                                    variables[j].reference = null;

                                    //variables[j].value = eval(slicedLine).toString();

                                    if(currentType === 'INTEGER')
                                    {
                                        variables[j].value = Math.floor(eval(slicedLine)).toString();
                                    }

                                    break;
                                }
                            }

                            code.push(outputLine);
                            break;
                        }
                       
                        
                        if(!isOperator(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba OPERADOR, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        outputLine += ` ${tokenLine[currentToken].value} `;
                        currentToken++;

                        if(!(isVariable(tokenLine[currentToken]) && variableExistsAndMatchesType(tokenLine[currentToken], variables, currentType)))
                        {
                            
                        } 
                        else
                        {
                            identifierToReplace.push(tokenLine[currentToken].value);
                        }
                        
                        outputLine += `${tokenLine[currentToken].value}`;
                        currentToken++;
                    }
                }

                //* CON PALABRAS RESERVADAS
                else if(isKeyword(tokenLine[currentToken]))
                {
                    //* LEER
                    if(tokenLine[currentToken].value === 'Leer')
                    {
                        
                        currentToken++;
                        
                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        if(currentType === 'STRING')
                        {
                            code.push(`${tempVariable.identifier} = input()`);
                        }
                        else if(currentType === 'DECIMAL')
                        {
                            code.push(`${tempVariable.identifier} = float(input())`);
                        }
                        else if(currentType === 'INTEGER')
                        {
                            code.push(`${tempVariable.identifier} = int(input())`);
                        }
                    }

                    //* LLENARMATRIZ
                    else if(tokenLine[currentToken].value === 'LlenarMatriz')
                    {
                        let matrix = [];
                        currentToken++;

                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentType = currentType.replace('_MATRIX', '');
                        outputLine = `${tempVariable.identifier} = np.array([[`;

                        currentToken++;

                        let matrixItem = [];

                        while(true)
                        {
                            if(tokenLine[currentToken].type === currentType)
                            {
                                matrixItem.push(tokenLine[currentToken].value);
                            }
                            else if(isVariable(tokenLine[currentToken]) && variableExistsAndMatchesType(tokenLine[currentToken], variables, currentType))
                            {
                                matrixItem.push(getVariableReferenceValue(tokenLine[currentToken].value, variables));
                            }
                            else
                            {
                                throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO del mismo tipo, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                                break;
                            }

                            outputLine += `${tokenLine[currentToken].value}`;
                            currentToken++;

                            if(isComma(tokenLine[currentToken]))
                            {
                                outputLine += `, `;
                                currentToken++;
                                continue;
                            }
                            else if(isColon(tokenLine[currentToken]))
                            {
                                matrix.push(matrixItem);
                                matrixItem = [];
                                outputLine += `], [`
                                currentToken++;
                                continue;
                            }
                            else if(isFinalParenthesis(tokenLine[currentToken]))
                            {
                                matrix.push(matrixItem);
                                outputLine += `]])`
                                currentToken++;

                                if(!isSemicolon(tokenLine[currentToken]))
                                {
                                    throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                                    break;
                                }
                                
                                for(let j = 0; j < variables.length; j++)
                                {
                                    if(tempVariable.identifier === variables[j].identifier)
                                    {
                                        variables[j].reference = null;
                                        variables[j].value = matrix;
                                        break;
                                    }
                                }

                                code.push(outputLine);    
                                break;
                            }
                            else
                            {
                                throw new Error(`Error (linea ${i+2}): se esperaba :, ) o , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                            }
                        }
                    }

                    //* INVERSA
                    else if(tokenLine[currentToken].value === 'Inversa')
                    {
                        currentToken++;
                        
                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!(isVariable(tokenLine[currentToken]) && (variableExistsAndMatchesType(tokenLine[currentToken], variables, 'INTEGER_MATRIX') || variableExistsAndMatchesType(tokenLine[currentToken], variables, 'DECIMAL_MATRIX'))))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba MATRIZ NUMERICA, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        let manipulatedVariable = tokenLine[currentToken].value;
                        currentToken++;
                        
                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        code.push(
                            `matrixRows = len(${manipulatedVariable})`,
                            `rowsLength = []`,
                            `for row in ${manipulatedVariable}:`,
                            `\trowsLength.append(len(row))`,
                            `isSquare = True`,
                            `for length in rowsLength:`,
                            `\tfor otherLength in rowsLength:`,
                            `\t\tif length != otherLength:`,
                            `\t\t\tisSquare = False;`,
                            `\t\t\tbreak`,
                            `\tif(not isSquare):`,
                            `\t\tbreak`,
                            `if not isSquare or matrixRows != rowsLength[0]:`,
                            `\traise Exception('Not squared')`,
                            `try:`,
                            `\t${tempVariable.identifier} = np.linalg.inv(${manipulatedVariable})`,
                            `except Exception as e:`,
                            `\tprint("No se puede hacer inversa, la matriz es singular")`
                        );
                    }

                    //* DIAGONAL
                    else if(tokenLine[currentToken].value === 'Diagonal')
                    {
                        currentToken++;
                        
                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!(isVariable(tokenLine[currentToken]) && (variableExistsAndMatchesType(tokenLine[currentToken], variables, 'INTEGER_MATRIX') || variableExistsAndMatchesType(tokenLine[currentToken], variables, 'DECIMAL_MATRIX'))))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba MATRIZ NUMERICA, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        tempVariable.identifier = tokenLine[currentToken].value;
                        currentToken++;
                        
                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        
                        code.push(
                            `matrixRows = len(${tempVariable.identifier})`,
                            `rowsLength = []`,
                            `for row in ${tempVariable.identifier}:`,
                            `\trowsLength.append(len(row))`,
                            `isSquare = True`,
                            `for length in rowsLength:`,
                            `\tfor otherLength in rowsLength:`,
                            `\t\tif length != otherLength:`,
                            `\t\t\tisSquare = False;`,
                            `\t\t\tbreak`,
                            `\tif(not isSquare):`,
                            `\t\tbreak`,
                            `if not isSquare or matrixRows != rowsLength[0]:`,
                            `\traise Exception('Las matrices no son iguales en dimensiones')`,
                            `for y in range(matrixRows):`,
                            `\tfor x in range(matrixRows):`,
                            `\t\tif y != x:`,
                            `\t\t\t${tempVariable.identifier}[y][x] = 0`,
                            `\t\t\tprint('{} no es igual a {}, se vuelve 0'.format(y, x))`,
                            `\t\tprint('{} es igual a {}, no se cambia el valor'.format(y, x))`,
                            `print('Resultado:')`,
                            `print(${tempVariable.identifier})`
                        );
                    }

                    //* DETERMINANTE
                    else if(tokenLine[currentToken].value === 'Determinante')
                    {
                        currentToken++;

                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!(isVariable(tokenLine[currentToken]) && (variableExistsAndMatchesType(tokenLine[currentToken], variables, 'INTEGER_MATRIX') || variableExistsAndMatchesType(tokenLine[currentToken], variables, 'DECIMAL_MATRIX'))))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba MATRIZ NUMERICA, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        let matrix = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        outputLine += `np.linalg.det(${matrix})`;
                        code.push(
                            `matrixRows = len(${matrix})`,
                            `rowsLength = []`,
                            `for row in ${matrix}:`,
                            `\trowsLength.append(len(row))`,
                            `isSquare = True`,
                            `for length in rowsLength:`,
                            `\tfor otherLength in rowsLength:`,
                            `\t\tif length != otherLength:`,
                            `\t\t\tisSquare = False;`,
                            `\t\t\tbreak`,
                            `\tif(not isSquare):`,
                            `\t\tbreak`,
                            `if not isSquare or matrixRows != rowsLength[0]:`,
                            `\traise Exception('Las matrices no son iguales en dimensiones')`,
                            outputLine
                            );
                        console.log('DETERMINANTE')
                    }

                    //* SUMARESTAMATRIZ
                    else if(tokenLine[currentToken].value === 'SumaRestaMatriz')
                    {
                        currentToken++;

                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!(isVariable(tokenLine[currentToken]) && (variableExistsAndMatchesType(tokenLine[currentToken], variables, 'INTEGER_MATRIX') || variableExistsAndMatchesType(tokenLine[currentToken], variables, 'DECIMAL_MATRIX'))))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba MATRIZ NUMERICA, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        outputLine += `${tokenLine[currentToken].value}`
                        currentToken++;

                        if(!((tokenLine[currentToken].value === '+' || tokenLine[currentToken].value === '-') && tokenLine[currentToken].type === 'OPERATOR'))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba OPERADOR, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        outputLine += ` ${tokenLine[currentToken].value} `
                        currentToken++;

                        if(!(isVariable(tokenLine[currentToken]) && (variableExistsAndMatchesType(tokenLine[currentToken], variables, 'INTEGER_MATRIX') || variableExistsAndMatchesType(tokenLine[currentToken], variables, 'DECIMAL_MATRIX'))))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba MATRIZ NUMERICA, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        outputLine += `${tokenLine[currentToken].value}`
                        currentToken++;

                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        code.push(outputLine);
                    }

                    //* FORMGENERAL
                    else if(tokenLine[currentToken].value === 'FormGeneral')
                    {
                        currentToken++;

                        if(!(currentType === 'STRING'))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE de tipo CADENA, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken], variables, 'INTEGER') || variableExistsAndMatchesType(tokenLine[currentToken], variables, 'DECIMAL') || tokenLine[currentToken].type === 'INTEGER' || tokenLine[currentToken].type === 'DECIMAL'))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO de tipo NUMERICO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        let a = tokenLine[currentToken].value;

                        currentToken++;

                        if(!isComma(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba , , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken], variables, 'INTEGER') || variableExistsAndMatchesType(tokenLine[currentToken], variables, 'DECIMAL') || tokenLine[currentToken].type === 'INTEGER' || tokenLine[currentToken].type === 'DECIMAL'))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO de tipo NUMERICO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        let b = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isComma(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba , , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken], variables, 'INTEGER') || variableExistsAndMatchesType(tokenLine[currentToken], variables, 'DECIMAL') || tokenLine[currentToken].type === 'INTEGER' || tokenLine[currentToken].type === 'DECIMAL'))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO de tipo NUMERICO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        let c = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`)
                        }

                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        cmathRequired = true;

                        code.push(
                            `discriminante = cmath.sqrt(${b}**2 - 4*${a}*${c})`,
                            `solucion1 = (-${b} + discriminante) / (2*${a})`,
                            `solucion2 = (-${b} - discriminante) / (2*${a})`,
                            `${tempVariable.identifier} = 'x1: {}, x2: {}'.format(solucion1, solucion2)`
                        )
                    }

                    //? NUMABSOLUTO
                    else if(tokenLine[currentToken].value === 'NumAbsoluto')
                    {
                        if(currentType === 'STRING')
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE de tipo NUMERICA, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }  

                        currentToken++;

                        if(!variableExistsAndMatchesType(tokenLine[currentToken], variables, currentType))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        tempVariable.identifier = tokenLine[currentToken].value;

                        currentToken++;

                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`)
                        }

                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        outputLine += `abs(${tempVariable.identifier})`;
                        
                        code.push(
                            outputLine
                            );
                        
                    }
                    
                    //* FUNCTRIGO
                    else if(tokenLine[currentToken].value === 'FuncTrigo')
                    {
                        console.log('llego')
                        if(currentType === 'STRING')
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE de tipo NUMERICA , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken], variables, 'STRING') || tokenLine[currentToken].type === 'STRING'))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE de tipo CADENA, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        let trigonometricFunction = tokenLine[currentToken].value.toLocaleLowerCase();

                        currentToken++;

                        if(!isComma(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba , , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!(tokenLine[currentToken].type === currentType || variableExistsAndMatchesType(tokenLine[currentToken], variables, currentType)))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO de tipo NUMERICO , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        let angle = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`)
                        }

                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        mathRequiered = true;

                        code.push(
                            `funcion_trigo = ${trigonometricFunction}`,
                            `angulo_radianes = math.radians(${angle})`,
                            `if funcion_trigo == "cos":`,
                            `\t${tempVariable.identifier} = math.cos(angulo_radianes)`,
                            `elif funcion_trigo == "sen":`,
                            `\t${tempVariable.identifier} = math.sin(angulo_radianes)`,
                            `elif funcion_trigo == "tan":`,
                            `\t${tempVariable.identifier} = math.tan(angulo_radianes)`,
                            `elif funcion_trigo == "sec":`,
                            `\t${tempVariable.identifier} = 1 / math.cos(angulo_radianes)`,
                            `elif funcion_trigo == "csc":`,
                            `\t${tempVariable.identifier} = 1 / math.sin(angulo_radianes)`, 
                            `elif funcion_trigo == "csc":`,
                            `\t${tempVariable.identifier} = math.cos(angulo_radianes) / math.sin(angulo_radianes)`,
                            `else:`,
                            `\traise Exception('Se esperaba una funcion trigonometrica')`,
                        );
                    }

                    //* AREACUAD
                    else if(tokenLine[currentToken].value === 'AreaCuad')
                    {
                        if(currentType === 'STRING')
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE de tipo NUMERICA, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken] ,variables , currentType) || tokenLine[currentToken].type === currentType))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        let option = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isComma(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba , , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken] ,variables , currentType) || tokenLine[currentToken].type === currentType))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        let side1 = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isComma(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba , , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken] ,variables , currentType) || tokenLine[currentToken].type === currentType))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        let side2 = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                       code.push(
                        `opcion = ${option}`,
                        `lado1 = ${side1}`,
                        `lado2 = ${side2}`,
                        `if opcion == 0 or opcion == 1 or opcion == 3:`,
                        `\t${tempVariable.identifier} = lado1 * lado2`,
                        `if opcion == 2:`,
                        `\t${tempVariable.identifier} = (lado1 * lado2) / 2`,
                        `else:`,
                        `\traise Exception('Se esperaba una opcion valida')`
                       )

                    }

                    //* POTENCIARAIZ
                    else if(tokenLine[currentToken].value === 'PotenciaRaiz')
                    {
                        currentToken++;

                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!variableExistsAndMatchesType(tokenLine[currentToken], variables, 'INTEGER'))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        let boolean = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isComma(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba , , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(currentType === 'STRING')
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE del mismo tipo, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        console.log(tokenLine[currentToken].value, tokenLine[currentToken].type, currentType);
                        console.log(!(variableExistsAndMatchesType(tokenLine[currentToken], variables, currentType)))
                        if(!(variableExistsAndMatchesType(tokenLine[currentToken], variables, currentType) || tokenLine[currentToken].type === currentType))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        let number = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isComma(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba , , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken], variables, currentType) || tokenLine[currentToken].type === currentType))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        let power = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        code.push(
                            `booleano = ${boolean}`,
                            `if booleano == 0:`,
                            `\t${tempVariable.identifier} = ${number} ** ${power}`,
                            `elif booleano == 1:`,
                            `\t${tempVariable.identifier} = ${number} ** (1/${power})`,
                            `else:`,
                            `\traise Exception('Se esperaba una opcion valida')`, 
                        );
                    }

                    //* REDONDEAR
                    else if(tokenLine[currentToken].value === 'Redondear')
                    {
                        currentToken++;

                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken], variables, 'INTEGER') || tokenLine[currentToken].type === 'INTEGER'))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        let boolean = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isComma(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba , , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(currentType === 'STRING' || currentType === 'INTEGER')
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE del mismo tipo, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken], variables, currentType) || tokenLine[currentToken].type === currentType))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        let number = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        mathRequiered = true;

                        code.push(
                            `booleano = ${boolean}`,
                            `if booleano == 0:`,
                            `\t${tempVariable.identifier} = math.floor(${number})`,
                            `elif booleano == 1:`,
                            `\t${tempVariable.identifier} = math.ceil(${number})`,
                            `else:`,
                            `\traise Exception('Se esperaba una opcion valida')`, 
                        );
                    }

                    //* FACTORIAL
                    else if(tokenLine[currentToken].value === 'Factorial')
                    {
                        currentToken++;
                        
                        if(currentType === 'STRING' || currentType === 'DECIMAL')
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ENTERO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken], variables , currentType) || tokenLine[currentToken].type === 'INTEGER'))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO del mismo tipo, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        outputLine += `math.factorial(${tokenLine[currentToken].value})`;
                        currentToken++;

                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        mathRequiered = true;

                        code.push(outputLine);

                    }

                    //* ANGULOVECTORIAL
                    else if(tokenLine[currentToken].value === 'AnguloVectorial')
                    {
                        if(currentType === 'STRING')
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ENTERO o DECMIAL, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken], variables, currentType) || tokenLine[currentToken].type === currentType))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO del mismo tipo, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        let x = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isComma(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba , , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken], variables, currentType) || tokenLine[currentToken].type === currentType))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO del mismo tipo, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        let y = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        mathRequiered = true;

                        code.push(
                            `angulo_radianes = math.atan2(${x}, ${y})`,
                            `${tempVariable.identifier} = math.degrees(angulo_radianes)`
                        )

                    }

                    //* HIPOTENUSA
                    else if(tokenLine[currentToken].value === 'Hipotenusa')
                    {
                        if(currentType === 'STRING')
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE de tipo NUMERICA, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        currentToken++;

                        if(!isInitialParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken] ,variables , currentType) || tokenLine[currentToken].type === currentType))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        let catA = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isComma(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba , , pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!(variableExistsAndMatchesType(tokenLine[currentToken] ,variables , currentType) || tokenLine[currentToken].type === currentType))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        let catB = tokenLine[currentToken].value;
                        currentToken++;

                        if(!isFinalParenthesis(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }
                        
                        currentToken++;

                        if(!isSemicolon(tokenLine[currentToken]))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        }

                        mathRequiered = true;

                        outputLine += `math.sqrt(${catA}**2 + ${catB}**2)`;
                        code.push(outputLine);
                    }
                }

                
            }

            //? SIN ASIGNACION
            else if(isKeyword(tokenLine[currentToken]))
            {
                //* TIPO 
                if(isAnyType(tokenLine[currentToken]))
                {
                    tempVariable.type = determineCurrentType(tokenLine[currentToken]);

                    currentToken++;

                    if(!isVariable(tokenLine[currentToken]))
                    {
                        throw new Error(`Error (linea ${i+2}): se esperaba IDENTIFICADOR, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                    }
                    
                    tempVariable.identifier = tokenLine[currentToken].value;

                    if(variableExists(tokenLine[currentToken], variables))
                    {
                        throw new Error(`Error (linea ${i+2}): ya existe una variable llamada ${tokenLine[currentToken].value}`);
                    }

                    currentToken++;

                    if(!isAssignEqualSymbol(tokenLine[currentToken]))
                    {
                        throw new Error(`Error (linea ${i+2}): se esperaba ASIGNACION, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                    }

                    currentToken++;

                    if(tokenLine[currentToken].type === tempVariable.type)
                    {
                        tempVariable.value = tokenLine[currentToken].value;
                    }
                    else if(isVariable(tokenLine[currentToken]) && variableExistsAndMatchesType(tokenLine[currentToken], variables, tempVariable.type))
                    {
                        tempVariable.reference = tokenLine[currentToken].value;
                    }
                    else
                    {
                        throw new Error(`Error (linea ${i+2}): se esperaba un DATO o VARIABLE, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                        continue;
                    }
                    
                    currentToken++;

                    if(!isSemicolon(tokenLine[currentToken]))
                    {
                        throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                    }

                    variables.push(tempVariable);
                    code.push(`${tempVariable.identifier} = ${getVariableValueOrReference(tempVariable, variables)}`);
                    console.log('Sintaxis de TIPO correcta');
                    
                    
                }
                
                //* DEFINIRMATRIZ
                else if(tokenLine[currentToken].value === 'DefinirMatriz')
                {
                    
                    currentToken++;

                    if(!isAnyType(tokenLine[currentToken]))
                    {
                        throw new Error(`Error (linea ${i+2}): se esperaba un TIPO de dato, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                    }

                    let currentType = determineCurrentType(tokenLine[currentToken]);
                    tempVariable.type = currentType+'_MATRIX';

                    currentToken++;

                    if(!isVariable(tokenLine[currentToken]))
                    {
                        throw new Error(`Error (linea ${i+2}): se esperaba IDENTIFICADOR, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                    }

                    tempVariable.identifier = tokenLine[currentToken].value;

                    currentToken++;

                    let isCorrect = true;

                    while(isCorrect)
                    {
                        
                        if(!(tokenLine[currentToken].value === '[' && tokenLine[currentToken].type === 'INITIAL_PUNCTUATOR'))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba [, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                            break;
                        }

                        currentToken++;

                        if(tokenLine[currentToken].type === 'INTEGER')
                        {
                            tempVariable.dimensions.push(tokenLine[currentToken].value);
                        }
                        else if(isVariable(tokenLine[currentToken]) && variableExistsAndMatchesType(tokenLine[currentToken], variables, 'INTEGER'))
                        {
                            tempVariable.dimensions.push(getVariableReferenceValue(tokenLine[currentToken].value, variables));
                        }
                        else
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba VARIABLE o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                            break;
                        }

                        currentToken++;

                        if(!(tokenLine[currentToken].value === ']' && tokenLine[currentToken].type === 'FINAL_PUNCTUATOR'))
                        {
                            throw new Error(`Error (linea ${i+2}): se esperaba ], pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                            break;
                        }
                        
                        currentToken++;

                        if(isSemicolon(tokenLine[currentToken]))
                        {  
                            numpyRequired = true;
                            console.log('DEFINIRMATRIZ')
                            variables.push(tempVariable);
                            break;
                        }
                    }
                }

                //* MOSTRAR
                else if(tokenLine[currentToken].value === 'Mostrar')
                {
                    currentToken++;

                    if(!isInitialParenthesis(tokenLine[currentToken]))
                    {
                        throw new Error(`Error (linea ${i+2}): se esperaba (, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                    }

                    currentToken++
                    
                    let valueToPrint = '';
                    if(!(isAnyData(tokenLine[currentToken]) || (isVariable(tokenLine[currentToken]) && variableExists(tokenLine[currentToken], variables))))
                    {
                        throw new Error(`Error (linea ${i+2}): se esperaba IDENTIFICADOR o DATO, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                    }

                    valueToPrint = tokenLine[currentToken].value;
                    currentToken++;

                    if(!isFinalParenthesis(tokenLine[currentToken]))
                    {
                        throw new Error(`Error (linea ${i+2}): se esperaba ), pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                    }
                    
                    currentToken++;

                    if(!isSemicolon(tokenLine[currentToken]))
                    {
                        throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                    }

                    code.push(`print(${valueToPrint})`);
                }

                //* EQUIPO
                else if(tokenLine[currentToken].value === 'Equipo')
                {
                    currentToken++;

                    if(!isSemicolon(tokenLine[currentToken]))
                    {
                        throw new Error(`Error (linea ${i+2}): se esperaba ;, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                    }

                    code.push('print("❖ Berrones Vázquez Jorge Luis.\\n❖ Coronado Mendoza Karime Audrey.\\n❖ Martínez Hernández Andrea Marell.\\n❖ Martínez Langarica Kevin.\\n❖ Mendoza Hernández Kevin Daniel (Líder).\\n❖ Sandoval García Sergio Alberto.")')
                }

                else
                {
                    throw new Error(`Error (linea ${i+2}): se esperaba PROPOSICION de asignación o INSTRUCCIÓN, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
                }
                
            }

            else
            {
                throw new Error(`Error (linea ${i+2}): se esperaba PROPOSICION de asignación o INSTRUCCIÓN, pero se recibio ${tokenLine[currentToken].value} de tipo ${tokenLine[currentToken].type}`);
            }
            
        }

        if(numpyRequired)
        {
            code.unshift('import numpy as np')
        }

        if(mathRequiered)
        {
            code.unshift('import math')  
        }

        if(cmathRequired)
        {
            code.unshift('import cmath')
        }
    }
    else
    {
        //throw new Error(`Error (linea ${1}): se esperaba INICIO, pero se encontró otro elemento`);
    }

    console.log(variables)
    console.log(code);

    return code;
}

export default compiler;