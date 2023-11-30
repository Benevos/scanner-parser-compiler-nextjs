async function doPoslishNotation(array, node)
{
    array.push(node.root)

    if(typeof node.left === 'object')
    {
        await doPoslishNotation(array, node.left);
    }
    else
    {
        array.push(array, node.left)
    }

    if(typeof node.right === 'object')
    {
        await doPoslishNotation(array, node.right);
    }
    else
    {
        array.push(node.right)
    }
}

export default async function getPolishNotation(node)
{
    var array = [];
    await doPoslishNotation(array, node);
    array = array.filter(item => typeof item !== 'object');

    return array;
}