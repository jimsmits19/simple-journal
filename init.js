const DAO = require('./repository/dao')
const JournalPageRepository = require('./repository/JournalPageRepository')

module.exports = () => {
    console.log("initing")
    const dao = new DAO('./database.sqlite3')
    const journalPageRepo = new JournalPageRepository(dao)

    journalPageRepo.createTable()
    
}

