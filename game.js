let cells = document.querySelectorAll('.cell');
let input_numbers = document.querySelectorAll('.input-number');

let active_cell;
let cell_is_active = false;
let cell_occupied = false;

let sudoku_template;
let sudoku_solution;

let error_count = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('load', () => {
    cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        let index = Array.prototype.indexOf.call(cells, cell);
        if(index % 9 == 2 || index % 9 == 5)
        {
            cell.style.borderRight = "2px solid #424242";
        }
        if((index - (index % 9)) == 18 || (index - (index % 9)) == 45)
        {
            cell.style.borderBottom = "2px solid #424242";
        }
    });

    const input_field = document.getElementById('input');
    const width = input_field.clientWidth;

    let input_numbers = document.querySelectorAll('.input-number');
    input_numbers.forEach(input_number => {
        input_number.style.width = (width/10).toString() + "px";
    });

    init_sudoku();
});

document.addEventListener('click', async function(e) {
    cells = document.querySelectorAll('.cell');
    const array_cells = Array.from(cells);
    input_numbers = Array.from(document.querySelectorAll('.input-number'));
    if(e.target == document.getElementById('input') || e.target == document.getElementById('game'))
    {
        console.log('input');
    } else if(input_numbers.includes(e.target))
    {
        const index = Array.prototype.indexOf.call(cells, document.getElementById(active_cell));
        if(cell_is_active && !cell_occupied)
        {
            const input_string = e.target.getAttribute('id').substring(5);
            const input_integer = parseInt(input_string);

            if(input_integer == sudoku_solution[index])
            {
                document.getElementById(active_cell).innerHTML = input_string;
                let template_array = sudoku_template.split('');
                template_array[index] = input_string;
                let temp_string = '';
                for (var i = 0; i < template_array.length; i++)
                {
                    temp_string += template_array[i];
                }
                sudoku_template = temp_string;
                document.getElementById(active_cell).classList.add('entered-number-cell');
            } else
            {
                document.getElementById(active_cell).classList.add('error-cell');
                error_count += 1;
                //document.getElementById('error-count').innerHTML = error_count.toString();

                let circle = 'c' + error_count.toString();
                document.getElementById(circle).style.backgroundColor = 'rgb(148, 68, 68)';

                if (error_count == 3)
                {
                    error_count = 0;
                    document.getElementById(active_cell).classList.remove('error-cell');
                    alert('3 errors. New Sudoku loaded');
                    document.getElementById('c1').style.backgroundColor = 'rgb(68, 182, 93)';
                    document.getElementById('c2').style.backgroundColor = 'rgb(68, 182, 93)';
                    document.getElementById('c3').style.backgroundColor = 'rgb(68, 182, 93)';
                    //document.getElementById('error-count').innerHTML = error_count.toString();
                    reload_sudoku();
                }
                await new Promise(r => setTimeout(r, 500));
                document.getElementById(active_cell).classList.remove('error-cell');
            }
            
            active_cell = null;
            cell_is_active = false;
            cell_occupied = true;
        }
        return;
    }
    else if(array_cells.includes(e.target))
    {
        input(e.target.id);
    }
    else
    {
        clear_focus();
    }
});

function load_sudoku()
{
    return ['174625569329400000680570000300000000806750093000086005000000170064030000005004032', ''];
}

function reload_sudoku()
{
    cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerHTML = '';
    });
    init_sudoku();
}

function init_sudoku()
{
    let sudoku = load_sudoku();
    sudoku_template = sudoku[0];
    sudoku_solution = sudoku[1];
    console.log(sudoku_template);

    draw_sudoku(sudoku_template);
}

function draw_sudoku(field)
{
    cells = document.querySelectorAll('.cell');
    let index = 0;
    cells.forEach(cell => {
        if(field[index] != '0')
        {
            cell.innerHTML = field[index];
            cell.classList.add('given-cell');
        }
        else
        {
            cell.innerHTML = '';
        }
        index += 1;
    });
}

function clear_focus()
{
    cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        if(cell.classList.contains('active-cell'))
        {
            cell.classList.remove('active-cell');
        }
        if(cell.classList.contains('visited-cell'))
        {
            cell.classList.remove('visited-cell');
        }
        if(cell.classList.contains('same-number-cell'))
        {
            cell.classList.remove('same-number-cell');
        }
    });
}

function input(id)
{
    clear_focus();

    const cell = document.getElementById(id);
    const index = Array.prototype.indexOf.call(cells, cell); //gets index of cell in cells
    const column_index = index % 9; 
    const row_start = index - column_index;

    const field_x = Math.floor(column_index / 3);
    const field_y = Math.floor((row_start / 9) /3);

    cells.forEach(cell => {
        let index = Array.prototype.indexOf.call(cells, cell);
        if((index % 9) == column_index || (index - (index % 9)) == row_start || (Math.floor((index % 9)/3) == field_x && Math.floor(((index - (index % 9))/9)/3) == field_y))
        {
            cell.classList.add('visited-cell');
        }
    });

    cell.classList.add('active-cell');

    active_cell = id;
    cell_is_active = true;

    if(cell.innerHTML.length != 0)
    {
        cell_occupied = true;
        const current_cell = cell.innerHTML; 
        cells.forEach(cell => {
            if(cell.innerHTML == current_cell)
            {
                cell.classList.add('same-number-cell');
            }
        })
    } else
    {
        cell_occupied = false;
    }
    
}
