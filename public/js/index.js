function generateRandomData() {}



initDb()
    .then(db => {
        selectAll(db, function (t, result) {});
    })
    .catch(error => console.error(error))