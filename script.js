// ЗАДАНИЕ Р1 — РАЗМИНКА 
console.log('A');
setTimeout(() => {console.log('B'); }, 1000);
console.log('C');
console.log('После setTimeout');
//ЗАДАНИЕ 1 — PROMISE
console.log('Отправляю заказ...');
const обещаниеЗаказа = new Promise((resolve) => {
    setTimeout(() => { resolve('Заказ принят');}, 1000); });
обещаниеЗаказа.then((result) => {console.log(result);});
console.log('Код пошёл дальше');
// ЗАДАНИЕ 2 — THEN И CATCH 
const сбой = new Promise((resolve, reject) => {reject('Склад не отвечает');});
сбой
    .then(() => {console.log('Успех');})
    .catch((error) => { console.log('ОБРАБОТКА: ' + error);});

const успех = new Promise((resolve) => {setTimeout(() => {resolve(123);}, 500);});
успех
    .then((value) => { console.log('Получили значение:', value); throw new Error('Ошибка внутри then'); })
    .then((value) => {console.log('Удвоенное значение:', value);  })
    .catch((error) => {console.log('Ошибка цепочки:', error.message);});
//УЧЕБНЫЙ ДВОЙНИК СЕРВЕРА 
function server(endpoint) {
    const база = {
        '/products/1': {
            id: 1,
            name: 'VELVET BLOOM',
            price: 1590,
            stock: 12
        },

        '/products/2': {
            id: 2,
            name: 'ROSE NOCTURNE',
            price: 1690,
            stock: 8
        },

        '/products/3': {
            id: 3,
            name: 'ECLAT',
            price: 1590,
            stock: 10
        },

        '/order': {
            ok: true,
            orderId: 'ARI-9081'
        }
    };

    return new Promise((resolve, reject) => {
        setTimeout(() => {
                            if (endpoint in база) {
                                resolve({
                                    ok: true,
                                    status: 200,
                                    body: база[endpoint] });
                            } else {
                                reject({
                                    ok: false,
                                    status: 404,
                                    error: 'Не найдено: ' + endpoint  });
                                    }
                        }, 600);
                                             });
}

//ЗАДАНИЕ 3 — ЦЕПОЧКА THEN 
server('/products/1')
    .then((r) => r.body)
    .then((product) => {
        console.log(
            product.name + ' — ' +
            product.price + ' ₽, на складе ' +
            product.stock
        );
         return product.price * 2;
    })
    .then((doublePrice) => { console.log('Удвоенная цена:', doublePrice + ' ₽'); })
    .catch((error) => { console.log('Ошибка:', error.error);});

server('/products/999')
    .catch((error) => { console.log('Ошибка ' + error.status + ': ' + error.error);});

//ЗАДАНИЕ 4 — ASYNC/AWAIT 
async function товар(id) {
    const r = await server('/products/' + id);
    return r.body;}

товар(2)
    .then((product) => {console.log('Товар:', product.name, '| Цена:', product.price + ' ₽' );})
    .catch((error) => {console.log('Ошибка:', error.error);});

async function получитьЗаказ() {
    const o = await server('/order');
    console.log('Номер заказа:', o.body.orderId);
}
получитьЗаказ();

async function показатьТовар() {
    const r = await server('/products/1');
    const product = r.body;

    console.log(
        product.name + ' — ' +
        product.price + ' ₽, на складе ' +
        product.stock
    );

    console.log('Удвоенная цена:', product.price * 2 + ' ₽');
}

показатьТовар();

// ЗАДАНИЕ 5 — TRY/CATCH/FINALLY 
async function проверитьТовар(id) {
    try {
        const r = await server('/products/' + id);
        console.log('Получен товар:', r.body.name);
    } catch (error) {
        console.log('НЕ ВЫШЛО: ' + error.error);
    } finally {
        console.log('Запрос завершён');
    }
}

проверитьТовар(1);
проверитьТовар(999);


//ЗАДАНИЕ 6 — PROMISE.ALL 
async function загрузитьДваТовара() {
    try {
        const [a, b] = await Promise.all([
            server('/products/1'),
            server('/products/2')
        ]);

        const товары = [a.body, b.body];

        товары.forEach((product) => {
            console.log(product.name + ' — ' + product.price + ' ₽');
        });

        const сумма = товары.reduce(
            (total, product) => total + product.price,
            0
        );

        console.log('Сумма двух свечей:', сумма + ' ₽');
    } catch (error) {
        console.log('Ошибка Promise.all:', error.error);
    }
}

загрузитьДваТовара();

async function проверитьВсеЗапросы() {
    try {
        const результаты = await Promise.all([
            server('/products/1'),
            server('/products/2'),
            server('/products/999')
        ]);

        console.log('Все запросы успешны:', результаты);
    } catch (error) {
        console.log('Promise.all завершился ошибкой:', error.error);
    }
}

проверитьВсеЗапросы();


