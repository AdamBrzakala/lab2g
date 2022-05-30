let db;

window.onload = () => {
    var request = indexedDB.open('clientData', 1);

    request.onupgradeneeded = function (e) {

        db = e.target.result;

        if (!db.objectStoreNames.contains('user')) {

            var objectStore = db.createObjectStore('user', { keyPath: 'id' });
            objectStore.createIndex('id', 'id', { unique: false });
            objectStore.createIndex('email', 'email', { unique: false });
            objectStore.createIndex('zipcode', 'zipcode', { unique: false });
            objectStore.createIndex('nip', 'nip', { unique: false });
            objectStore.createIndex('dowod', 'dowod', { unique: false });
            objectStore.createIndex('ip4', 'ip4', { unique: false });
            objectStore.createIndex('www', 'www', { unique: false });
            objectStore.createIndex('diskA', 'diskA', { unique: false });
            objectStore.createIndex('diskB', 'diskB', { unique: false });
            objectStore.createIndex('ip6', 'ip6', { unique: false });
            objectStore.createIndex('catalog', 'catalog', { unique: false });
            objectStore.createIndex('phone', 'phone', { unique: false });
        }
    }

    request.onsuccess = function (e) {
        console.log('Database opened!');
        db = e.target.result;
        loadData();
    }

    request.onerror = function (e) {
        console.log('Database opening error!');
    }
};

function remove(elem) {
    elem.parentElement.remove();
}

function loadData() {
    const request = db.transaction('user').objectStore('user').getAll();

    document.getElementById('klienci').innerHTML = "";

    request.onsuccess = () => {
        request.result.forEach(element => {
            var node = document.createElement('li');
            node.appendChild(document.createTextNode(JSON.stringify(element, null, 4)));
            document.getElementById('klienci').appendChild(node);
        });
    }

    request.onerror = (err) => {
        console.error(`Error on loadData() function`)
    }
}

function saveData() {
    var newUser = getclientData();
    const transaction = db.transaction(['user'], 'readwrite');
    const objectStore = transaction.objectStore('user');
    const request = objectStore.put(newUser);
    request.onsuccess = event => {
        loadData();
    };
}

function exampleText() {
    var email = document.getElementById('email');
    var zipcode = document.getElementById('zipcode');
    var nip = document.getElementById('nip');
    var dowod = document.getElementById('dowod');
    var ip4 = document.getElementById('ip4');
    var www = document.getElementById('www');
    var diskA = document.getElementById('diskA');
    var diskB = document.getElementById('diskB');
    var ip6 = document.getElementById('ip6');
    var catalog = document.getElementById('catalog');
    var phone = document.getElementById('phone');
    email.value = "raz@gmail.com";
    zipcode.value = "91-112";
    nip.value = "100-10-20-200";
    dowod.value = "ABC 123456";
    ip4.value = "192.168.1.1";
    www.value = "www.google.com";
    diskA.value = 'c:\\windows\\temp';
    diskB.value = "C:\\Windows\\temp";
    catalog.value = "/etc/passwd";
    ip6.value = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";
    phone.value = "492 492 492";
}

function clearText() {
    var email = document.getElementById('email');
    var zipcode = document.getElementById('zipcode');
    var nip = document.getElementById('nip');
    var dowod = document.getElementById('dowod');
    var ip4 = document.getElementById('ip4');
    var www = document.getElementById('www');
    var diskA = document.getElementById('diskA');
    var diskB = document.getElementById('diskB');
    var ip6 = document.getElementById('ip6');
    var catalog = document.getElementById('catalog');
    var phone = document.getElementById('phone');
    email.value = "";
    zipcode.value = "";
    nip.value = "";
    dowod.value = "";
    ip4.value = "";
    www.value = "";
    diskA.value = "";
    diskB.value = "";
    catalog.value = "";
    ip6.value = "";
    phone.value = "";

    var request = db.transaction(["user"], "readwrite")
        .objectStore("user")
        .clear();

    request.onsuccess = event => {
        loadData();
        searchUser();
    };
}

function getclientData() {

    var email = document.getElementById('email').value;
    var zipcode = document.getElementById('zipcode').value;
    var nip = document.getElementById('nip').value;
    var dowod = document.getElementById('dowod').value;
    var ip4 = document.getElementById('ip4').value;
    var www = document.getElementById('www').value;
    var diskA = document.getElementById('diskA').value;
    var diskB = document.getElementById('diskB').value;
    var ip6 = document.getElementById('ip6').value;
    var catalog = document.getElementById('catalog').value;
    var phone = document.getElementById('phone').value;

    return {
        id: new Date().getTime(),
        email: email,
        zipcode: zipcode,
        ip4: ip4,
        nip: nip,
        dowod: dowod,
        www: www,
        diskA: diskA,
        diskB: diskB,
        ip6: ip6,
        catalog: catalog,
        phone: phone
    }
}

function searchUser() {
    var id_re = document.getElementById('search_id').value;
    var email_re = document.getElementById('search_email').value;
    var kod_re = document.getElementById('search_kod').value;
    var nip_re = document.getElementById('search_nip').value;
    var dowod_re = document.getElementById('search_dowod').value;
    var telefon_re = document.getElementById('search_telefon').value;

    document.getElementById('wyszukiwanie').innerHTML = "";
    
    var transaction = db.transaction(["user"], "readwrite");
    var objectStore = transaction.objectStore("user");
    var request = objectStore.openCursor();

    request.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            if (new RegExp(id_re).test(cursor.value.id) &&
                new RegExp(email_re).test(cursor.value.email) &&
                new RegExp(kod_re).test(cursor.value.zipcode) &&
                new RegExp(nip_re).test(cursor.value.nip) &&
                new RegExp(dowod_re).test(cursor.value.dowod) &&
                new RegExp(telefon_re).test(cursor.value.phone)) 
            {                
                var node = document.createElement('li');
                node.appendChild(document.createTextNode(JSON.stringify(cursor.value), null, 4));

                var deleteBtn = document.createElement("button");
                deleteBtn.innerText = "Delete";
                deleteBtn.onclick = () => { deleteUserWithID(cursor.value.id); };

                node.appendChild(deleteBtn);
                document.getElementById('wyszukiwanie').appendChild(node);
            }

            cursor.continue();          
        }
    };
}

function deleteUser() {
    var userid = document.getElementById('delete_id').value;
    deleteUserWithID(userid);
}

function deleteUserWithID(userid) {
    var transaction = db.transaction(["user"], "readwrite");
    var objectStore = transaction.objectStore("user");
    var request = objectStore.openCursor();

    request.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log(cursor.value.id);           

            if (String(userid) === String(cursor.value.id)) {
                cursor.delete();
                loadData();
                searchUser();
            }

            cursor.continue();          
        }
    };
}
