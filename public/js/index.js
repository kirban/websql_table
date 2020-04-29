let data = [];

function sortColumn(columnName) {
    const dataType = typeof data[0][columnName],
        sortDirection = !sortDirection;

    if (columnName === 'date') {
        dataType = 'date'
    }

    switch (columnName) {
        case 'number':

            break;
        case 'string':

            break;
        case 'date':

            break;
        default:
            break;
    }
}

function clearTable() {
    document.querySelector('tbody').innerHTML = '';
}

// function editBtnHandler(event) {

// }

// function removeBtnHandler(event) {


//     //TODO:add db removeRow
// }

function generateRandomData() {}

function renderTableData(tableData) {
    const tableBody = document.querySelector("tbody");
    let htmlData = "";
    let index = 0;

    for (let row of tableData) {
        index++;
        htmlData += `
        <tr data-id="${index}">
            <th scope="row">${index}</th>
            <td>
                <span class="td__content">${row.date}</span>
                <input type="date" class="d-none td__content input-date form-control" value="${row.date}">
            </td>
            <td>
                <span class="td__content">${row.provider}</span>
                <input type="text" class="d-none td__content input-provider form-control" value="${row.provider}">
            </td>
            <td>
                <span class="td__content">${row.warehouse}</span>
                <input type="text" class="d-none td__content input-warehouse form-control" value="${row.warehouse}">
            </td>
            <td>
                <span class="td__content">${row.product}</span>
                <input type="text" class="d-none td__content input-product form-control" value="${row.product}">
            </td>
            <td>
                <span class="td__content">${row.quantity}</span>
                <input type="number" min="0" step="1" class="d-none td__content input-quantity form-control" value="${row.quantity}">
            </td>
            <td>
                <span class="td__content">${row.sum}</span>
                <input type="number" min="0" class="d-none td__content input-sum form-control" value="${row.sum}">
            </td>
            <td data-id="${index}" class="d-print-none">
                <div class="row__actions d-flex justify-content-between">
                    <a class="row_action edit" data-id="${index}"><i class="fa fa-pencil"></i></a>
                    <a class="row_action remove" data-id="${index}"><i class="fa fa-trash"></i></a>
                </div>
            </td>
        </tr>`;
    }

    tableBody.insertAdjacentHTML('afterbegin', htmlData);
}


window.onload = () => {
    initDb()
        .then(db => {
            // appendRow(db, "30.12.2012", 'p1', 'w1', 'product1', 24, 1800);
            selectAll(db, function (t, result) {
                data = [...Object.values(result.rows)];

                document.querySelector('tbody')
                    .addEventListener('DOMNodeInserted', function (e) {
                        if (e.target.tagName !== "TR") return;
                        const row = e.target;

                        row.querySelector(".row_action.edit").addEventListener('click', function (event) {
                            let target = event.currentTarget,
                                targetDataId = target.getAttribute('data-id'),
                                inputs = Array.from(row.querySelectorAll('input'));

                            // make inputs visible
                            row.querySelectorAll('.td__content').forEach(cellContent => {
                                cellContent.classList.toggle('d-none');
                            })

                            //send request to websql db
                            if (target.querySelector('i.fa-floppy-o') !== null) {
                                // in case when we want to save data
                                console.log('changed!');
                                let date = inputs.filter(input => input.type === 'date')[0].value || "1970-01-01",
                                    provider = inputs.filter(input => input.classList.contains('input-provider'))[0].value || "",
                                    warehouse = inputs.filter(input => input.classList.contains('input-warehouse'))[0].value || "",
                                    product = inputs.filter(input => input.classList.contains('input-product'))[0].value || "",
                                    quantity = inputs.filter(input => input.classList.contains('input-quantity'))[0].value || 0,
                                    sum = inputs.filter(input => input.classList.contains('input-sum'))[0].value || 0;

                                updateRow(db, targetDataId, date, provider, warehouse, product, quantity, sum);

                                data[targetDataId - 1] = {
                                    date,
                                    provider,
                                    warehouse,
                                    product,
                                    quantity,
                                    sum
                                };
                                clearTable();
                                renderTableData(data);
                            }

                            //change icon to save icon
                            target.querySelector('i').classList.toggle('fa-pencil');
                            target.querySelector('i').classList.toggle('fa-floppy-o');
                        })


                        row.querySelector(".row_action.remove").addEventListener('click', function (event) {
                            let target = event.currentTarget,
                                targetDataId = target.getAttribute('data-id');

                            row.parentNode.removeChild(row);

                            removeRow(db, (targetDataId - 1));
                            data.splice((targetDataId - 1), 1);
                            clearTable();
                            renderTableData(data);
                        })

                    })

                renderTableData(data);
            });
        })
        .catch(error => console.error(error))
}