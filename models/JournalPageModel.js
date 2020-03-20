
class JournalPageModel {
    constructor(JournalPageRepository) {
        this.journalPageRepo = JournalPageRepository;
    }
    
    write(journalPage) {
        this.journalPageRepo.create(
            journalPage.id, 
            journalPage.version,
            journalPage.text
        )
    }

    get(id) {
        return this.journalPageRepo.getById(id)
    }

    getIDs() {
        return this.journalPageRepo.getField('id');
    }



}

module.exports = JournalPageModel