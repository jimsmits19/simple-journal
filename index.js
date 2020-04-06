//KISS
const express = require('express')
const JournalPageModel = require('./models/JournalPageModel')
const DAO = require('./repository/dao')
const JournalPageRepository = require('./repository/JournalPageRepository')
const init = require('./init')
const app = express()
const port = 3000

const dao = new DAO('./database.sqlite3')
const journalPageRepo = new JournalPageRepository(dao)
const journalPageModel = new JournalPageModel(journalPageRepo)

app.use(express.json());

app.get('/design', async (req, res) => {
    res.sendFile(__dirname + '/design.css');
})

app.get('/js/journal', async (req, res) => {
    res.sendFile(__dirname + '/journal.js');
})

app.get('/', (req, res) => {
    //Check for today's entry.
    //if found, redirect to entry page.
    //else send index page. 
    res.sendFile(__dirname + '/views/index.html')
})

app.get('/entry/:id', (req,res) => {
    res.sendFile(__dirname + '/views/entry.html')
})

app.get('/api/entry/:id', async (req,res)  =>  {
    console.log('get entry');
    const id = req.params['id'];
    console.log('getting entry with id ' + id);
    let page = await journalPageModel.get(id);
    if (page === undefined) {
        page = { id:today(), version:-1, text:''}
    }
    console.log('sending ' + page);
    res.send(page);
})

app.post('/api/entry', (req, res) => {
    console.log('post rec\'d')
    journalPageModel.write(req.body);
    res.sendStatus(201);
})

app.get('/entries', (req, res) => {
    console.log('sending entries html')
    res.sendFile(__dirname + '/views/entries.html')
})

app.get('/api/entries', async (req, res) => {
    console.log('getting entries')
    let ids = await journalPageModel.getIDs();
    console.log(ids);
    console.log('sending entries');
    res.send(ids);
})

app.get('/open', async (req, res) => {
    res.sendFile(__dirname + '/views/open.html');
})

function today() {

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return yyyy + mm + dd;
}



app.listen(port, () => console.log(`Example app listening on port ${ port }!`))

init();

// Brain dump --> 

//TODO: only save a version on line break?  So update latest version until there is a line break, then update new version???
//TODO: realtime dictionary lookup window on word complete.
//TODO: another app - When star in chrome, copy link to a link dump in drop box or something.
//TODO: command window - /prompt for load prompts.and more...
//get - return today's journal
    // Full page text area with post happening onkeyup.
        // Text area should be home brew in order to support markdown.
        // radio button list would be nice for mood tracking.
        // Record all keystrokes?
    // Storage??? - 
        //Local Storage (for offline use) with ServerSide backup?
        //Flat Files on server?
    // when using date as a primary key and "object" representing a journal entry, what to do about a entry that starts and finishes pre/post midnight?
    //consider - instead of updating our version with every keystroke, update it with every keycode 13.

//post - post to today's journal



//browse/get return view of all journal entries.
//browse/delete - now why would you want to do that -- hmm?
//look/get return view of past journal entry.
//annotate - M/U past journal entry.