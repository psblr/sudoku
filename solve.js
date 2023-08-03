function string_to_array(sudoku_string)
{
    var sudoku_array = new Array(9);
    
    var index = 0;
    for (var i = 0; i < 9; i++)
    {
        sudoku_array[i] = [];
        for (var j = 0; j < 9; j++)
        {
            sudoku_array[i][j] = parseInt(sudoku_string[index]);
            index += 1
        }
    }
    return sudoku_array;
}

function array_to_string(sudoku_array)
{
    var sudoku_string = '';
    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            sudoku_string += sudoku_array[i][j].toString();
        }
    }
    return sudoku_string;
}

function get_column(n, index)
{
    var column = [];
    for (var i = 0; i < 9; i++)
    {
        column[i] = n.field[i][index];
    }
    return column;
}

function get_field(n, i, j)
{
    var sub_field = [];
    const xy = [Math.floor(i / 3), Math.floor(j / 3)];

    for (var k = 0; k < 9; k++)
    {
        for (var l = 0; l < 9; l++)
        {
            if (Math.floor(k/3) == xy[0] && Math.floor(l/3) == xy[1])
            {
                sub_field.push(n.field[k][l]);
            }
        }
    }
    //console.log(sub_field);
    return sub_field;
}

class Node 
{
    constructor(parent, field)
    {
        this.parent = parent;
        this.field = field;
    }
}

function succ(n)
{
    var children = [];

    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
            {
                if (n.field[i][j] == 0)
                {
                    for (var number = 1; number < 10; number++)
                    {
                        if(!n.field[i].includes(number))
                        {
                            var column = get_column(n, j);
                            if(!column.includes(number))
                            {
                                var sub_field = get_field(n, i, j);
                                if(!sub_field.includes(number))
                                {
                                    //console.log(number);
                                    //console.log(n.field[i]);
                                    //console.log(column);
                                    //console.log(sub_field);
                                    var children_field = JSON.parse(JSON.stringify(n.field));
                                    children_field[i][j] = number;
                                    var child = new Node(n, children_field);
                                    children.push(child);
                                }
                            }
                        }
                    }
                    //console.log(children);
                    return children;
                }
            }
    }
}

function star(n)
{
    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
            {
                if (n.field[i][j] == 0)
                {
                    return false;
                }
            }
    }
    return true;
}

async function tree_search(n0, succ, star)
{
    var open = [];
    open.push(n0);
    while(open.length > 0)
    {
        var n = open[0];
        open.shift();
        var c = succ(n);
        for (var i = 0; i < c.length; i++)
        {
            if (star(c[i]))
            {
                draw_sudoku(array_to_string(c[i].field));
                return c[i];
            }
            open.unshift(c[i]);
            await sleep(100);
            draw_sudoku(array_to_string(c[i].field));
            
        }
    }
    return null;
}

function solve()
{
    /*let index = 0;
    cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const text = sudoku_solution[index];
        cell.innerHTML = text;
        cell.classList.add('given-cell');
        index += 1;
    });
    string_to_array(sudoku_template);*/
    var n = new Node(null, string_to_array(sudoku_template));
    tree_search(n, succ, star).then(res => {
        let a = array_to_string(res.field);
        if (a == sudoku_solution)
        {
            console.log('solved');
        }
    });
}
