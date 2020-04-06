document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const journalEntry = {}
    var check;
    saveStatus.classList.add('statusSaved');

    fetch('api/entry/' + today())
        .then(async function (data) {
            const entry = await data.json();

            check = await digestMessage(entry.text);

            journalEntry.id = entry.id;
            journalEntry.text = entry.text;
            journalEntry.version = entry.version;
            console.log(`Got: Id: ${entry.id}, Version: ${entry.version}`);

        }).then(() => {
            journalPage.focus();
            journalPage.innerText = journalEntry.text;

            journalPage.addEventListener('keydown', async event => {
                saveStatus.classList.add('statusNotSaved');
                saveStatus.classList.remove('statusSaved');
            })

            journalPage.addEventListener('keyup', async event => {
                if (event.key == 'Enter') {
                    save()
                }
            });

            setInterval(async ()=>{
                let match = await digestMessage(journalPage.innerText);
                if (match !== check) {
                    save();
                };
            }, 6000)
            
            async function save() {
                journalEntry.version = Date.now();
                journalEntry.text = journalPage.innerText;
                fetch('/api/entry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(journalEntry)
                });
                check = await digestMessage(journalPage.innerText);
                saveStatus.classList.add('statusSaved');
                saveStatus.classList.remove('statusNotSaved');
                console.log("saved.");
            }

        })
        .catch(function (error) {
            console.error(error)
        });
    // journalPage.innerText = 'start typing... (ctrl+enter to save)';
    // journalPage.focus();
    // 
    // journalPage.addEventListener('keydown', () => {
    //     if (journalPage.innerText === 'start typing... (ctrl+enter to save)') {
    //         journalPage.innerText = '';
    //     }
    // })


});

function today() {

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return yyyy + mm + dd;
}

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}