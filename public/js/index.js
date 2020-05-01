let data = [],
    addingData = false;

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

function editBtnHandler(row, event, db) {
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

        let rowIndex = data.findIndex(el => el.rowid === Number(targetDataId));

        if (rowIndex !== -1){
            data[rowIndex] = {
                rowid: targetDataId,
                date,
                provider,
                warehouse,
                product,
                quantity,
                sum
            };
        }
        
        tableReload(data);
    }

    //change icon to save icon
    target.querySelector('i').classList.toggle('fa-pencil');
    target.querySelector('i').classList.toggle('fa-floppy-o');
}

function addRowHandler(db) {
    if (addingData) return;

    const newRow = `
        <tr>
            <th scope="row"></th>
            <td class="form-group">
                <input type="date" name="date" form="saveForm" class="form-control td__content input-date form-control" required="required">
            </td>
            <td class="form-group">
                <input type="text" name="provider" form="saveForm" class="form-control td__content input-provider form-control" required="required">
            </td>
            <td class="form-group">
                <input type="text" name="warehouse" form="saveForm" class="form-control td__content input-warehouse form-control" required="required">
            </td>
            <td class="form-group">
                <input type="text" name="product" form="saveForm" class="form-control td__content input-product form-control" required="required">
            </td>
            <td class="form-group">
                <input type="number" name="quantity" form="saveForm" min="1" step="1" class="form-control td__content input-quantity form-control" required="required">
            </td>
            <td class="form-group">
                <input type="number" name="sum" form="saveForm" min="0" class="form-control td__content input-sum form-control" required="required">
            </td>
            <td class="d-print-none">
                <div class="row__actions d-flex justify-content-between">
                    <button type="submit" form="saveForm" class="row_action save" data-id="-1"><i class="fa fa-floppy-o"></i></button>
                    <button type="button" class="row_action remove" data-id="-1"><i class="fa fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `;

    document.querySelector('tbody').insertAdjacentHTML('beforeend', newRow);
    addingData = true;

    document.querySelector('.save[data-id="-1"]')
        .addEventListener('click', function (e) {
            e.preventDefault();
            addingData = false;

            let form = document.forms[0],
                date = form.elements.date.value,
                provider = form.elements.provider.value,
                warehouse = form.elements.provider.value,
                product = form.elements.product.value,
                quantity = form.elements.quantity.value,
                sum = form.elements.quantity.value;
        
            //TODO: fix this shit ..., create normal validation
            if (date.length === 0) {
                alert(`Field date is empty!`);
                return;
            }
            if (provider.length === 0) {
                alert(`Field provider is empty!`);
                return;
            }
            if (warehouse.length === 0) {
                alert(`Field warehouse is empty!`);
                return;
            }
            if (product.length === 0) {
                alert(`Field product is empty!`);
                return;
            }
            if (quantity.length === 0) {
                alert(`Field quantity is empty!`);
                return;
            }
            if (sum.length === 0) {
                alert(`Field sum is empty!`);
                return;
            }

            data.push({date,provider,warehouse,product,quantity,sum});

            appendRow(db, date, provider, warehouse, product, quantity, sum);

            tableReload(data);
        })
}

function generateRandomData() {}

function renderTableData(tableData) {
    const tableBody = document.querySelector("tbody");
    let htmlData = "";
    let index = 0;

    for (let row of tableData) {
        index++;
        htmlData += `
        <tr data-id="${row.rowid}">
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
            <td data-id="${row.rowid}" class="d-print-none">
                <div class="row__actions d-flex justify-content-between">
                    <a class="row_action edit" data-id="${row.rowid}"><i class="fa fa-pencil"></i></a>
                    <a class="row_action remove" data-id="${row.rowid}"><i class="fa fa-trash"></i></a>
                </div>
            </td>
        </tr>`;
    }

    tableBody.insertAdjacentHTML('afterbegin', htmlData);
}

function tableReload(data){
    clearTable();
    renderTableData(data);
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

                        if (row.querySelector(".row_action.edit")) {
                            row.querySelector(".row_action.edit")
                                .addEventListener('click', function (event) {
                                    editBtnHandler(row, event, db);
                                });
                        }

                        row.querySelector(".row_action.remove")
                            .addEventListener('click', function (event) {
                                let target = event.currentTarget,
                                    targetDataId = target.getAttribute('data-id');

                                let rowId = data.findIndex(el => el.rowid === Number(targetDataId));
                                data.splice(rowId, 1);
                                row.parentNode.removeChild(row);

                                if (targetDataId != -1) {
                                    removeRow(db, targetDataId);
                                    data.splice(targetDataId, 1);
                                }

                                if (addingData) addingData = !addingData;

                                tableReload(data);
                            });
                    })

                document.querySelector('#add-row')
                    .addEventListener('click', function() {
                        addRowHandler(db);
                    });

                renderTableData(data);
            });
        })
        .catch(error => console.error(error))
}