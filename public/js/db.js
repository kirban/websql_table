function initDb() {
    return new Promise((resolve, reject) => {
        const db = openDatabase("testDB", "1", "Table of parts", 5 * 1024 * 1024);
        if (!db) {
            reject("failed to connect to db");
        }

        countAll(db, function (result) {
            console.log("table exists");
            
            // load data in table

            resolve(db);
        }, function (t, error) {
            console.log("new table");
            t.executeSql('CREATE TABLE IF NOT EXISTS parts (date DATE, provider VARCHAR(256), warehouse VARCHAR(256), product VARCHAR(256), quantity INT(32), sum REAL)', [], null, null);
            resolve(db);
        })
    });
}

function selectAll(db, onResult = null, onError = null) {
    db.transaction(function (t) {
        t.executeSql("SELECT * FROM parts", [], onResult, onError)
    })
}

function countAll(db, onResult = null, onError = null) {
    db.transaction(function (t) {
        t.executeSql("SELECT COUNT(*) FROM parts", [], onResult, onError)
    })
}

function appendRow(db, date, provider, warehouse, product, quantity, sum, onResult = null, onError = null) {
    db.transaction(function (t) {
        t.executeSql("INSERT INTO parts (date, provider, warehouse, product, quantity, sum) VALUES (?,?,?,?,?,?)", [date, provider, warehouse, product, quantity, sum], onResult, onError)
    })
}

function updateRow(db, id, date, provider, warehouse, product, quantity, sum, onResult = null, onError = null) {
    db.transaction(function (t) {
        t.executeSql("UPDATE parts SET date=?, provider=?, warehouse=?, product=?, quantity=?, sum=? WHERE rowid=?", [date, provider, warehouse, product, quantity, sum, id], onResult, onError)
    })
}

function removeRow(db, id, onResult = null, onError = null) {
    db.transaction(function (t) {
        t.executeSql("DELETE FROM parts WHERE rowid=?", [id], onResult, onError);
    })
}

function clearTable(db) {
    db.transaction(function (t) {
        t.executeSql("TRUNCATE TABLE parts")
    })
}